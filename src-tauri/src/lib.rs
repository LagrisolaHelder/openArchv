use std::fs::{File, create_dir_all};
use std::path::PathBuf;
use tauri::Emitter; 
use compress_tools::{ArchiveContents, ArchiveIteratorBuilder};

#[derive(Clone, serde::Serialize)]
struct ProgressPayload {
    percentage: u8,
}

#[tauri::command]
fn open_browser(url: String) -> Result<(), String> {
    open::that(url).map_err(|e| e.to_string())
}

#[tauri::command]
async fn extract_archive(window: tauri::Window, file_path: String) -> Result<String, String> {
    // 1. Resolve path parameters safely before sending across thread lines
    let path = PathBuf::from(&file_path);
    let parent_dir = path.parent().unwrap_or(&std::path::Path::new(".")).to_path_buf();
    let folder_name = path
        .file_stem()
        .ok_or_else(|| "Invalid archive file name structure.".to_string())?
        .to_os_string();
        
    let output_dir = parent_dir.join(folder_name);
    let output_dir_clone = output_dir.clone();

    // 2. Offload the heavy synchronous disk loop onto an un-managed background task
    tauri::async_runtime::spawn(async move {
        if let Err(_) = create_dir_all(&output_dir) {
            let _ = window.emit("extraction-progress", ProgressPayload { percentage: 0 });
            return;
        }

        let source_file = match File::open(&path) {
            Ok(f) => f,
            Err(_) => return,
        };
        let total_bytes = source_file.metadata().map_or(0.0, |m| m.len() as f64);
        
        let source_file_for_iter = match File::open(&path) {
            Ok(f) => f,
            Err(_) => return,
        };
        let iter = match ArchiveIteratorBuilder::new(source_file_for_iter).build() {
            Ok(i) => i,
            Err(_) => return,
        };

        let mut current_bytes = 0.0;

        for content in iter {
            match content {
                ArchiveContents::StartOfEntry(name, _stat) => {
                    let target_path = output_dir.join(&name);
                    if name.ends_with('/') {
                        let _ = create_dir_all(&target_path);
                    } else if let Some(parent) = target_path.parent() {
                        let _ = create_dir_all(parent);
                    }
                }
                ArchiveContents::DataChunk(bytes) => {
                    current_bytes += bytes.len() as f64;
                    if total_bytes > 0.0 {
                        let ratio: f64 = (current_bytes / total_bytes) * 100.0;
                        let pct = ratio.round() as u8;
                        let safe_pct = std::cmp::min(pct, 99);
                        let _ = window.emit("extraction-progress", ProgressPayload { percentage: safe_pct });
                    }
                }
                ArchiveContents::EndOfEntry => {}
                ArchiveContents::Err(_) => return,
            }
        }

        let mut final_source = match File::open(&path) {
            Ok(f) => f,
            Err(_) => return,
        };
        
        if compress_tools::uncompress_archive(&mut final_source, &output_dir, compress_tools::Ownership::Ignore).is_ok() {
            // Send the final completion call
            let _ = window.emit("extraction-progress", ProgressPayload { percentage: 100 });
        }
    });

    // 3. Hand control right back to React immediately so the UI remains active
    Ok(output_dir_clone.to_string_lossy().into_owned())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![open_browser, extract_archive])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}