use std::fs::{File, create_dir_all, remove_dir_all};
use std::path::PathBuf;
use std::sync::Arc;
use std::sync::atomic::{AtomicBool, Ordering};
use tauri::{Emitter, State}; 
use compress_tools::{ArchiveContents, ArchiveIteratorBuilder};

#[derive(Clone, serde::Serialize)]
struct ProgressPayload {
    percentage: u8,
}

// ✨ Global state structure to manage and share cancellation flags safely between threads
pub struct ExtractionState {
    pub should_cancel: Arc<AtomicBool>,
}

#[tauri::command]
fn open_browser(url: String) -> Result<(), String> {
    open::that(url).map_err(|e| e.to_string())
}

// ✨ Command called by React to abort the active task loop instantly
#[tauri::command]
fn cancel_extraction(state: State<'_, ExtractionState>) -> Result<(), String> {
    state.should_cancel.store(true, Ordering::SeqCst);
    Ok(())
}

#[tauri::command]
async fn extract_archive(
    window: tauri::Window, 
    file_path: String,
    state: State<'_, ExtractionState> // ✨ Inject our managed cancellation state
) -> Result<String, String> {
    // Reset our cancel token flag back to false for the new operations loop
    state.should_cancel.store(false, Ordering::SeqCst);
    let cancel_flag = state.should_cancel.clone();

    let path = PathBuf::from(&file_path);
    let parent_dir = path.parent().unwrap_or(&std::path::Path::new(".")).to_path_buf();
    let folder_name = path
        .file_stem()
        .ok_or_else(|| "Invalid archive file name structure.".to_string())?
        .to_os_string();
        
    let output_dir = parent_dir.join(folder_name);
    let output_dir_clone = output_dir.clone();

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
            // 🛑 CHECK INTERRUPT: If React clicked cancel, abort immediately, clean files, and exit thread
            if cancel_flag.load(Ordering::SeqCst) {
                let _ = remove_dir_all(&output_dir); // Wipe half-extracted debris
                let _ = window.emit("extraction-progress", ProgressPayload { percentage: 0 });
                return;
            }

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
                ArchiveContents::Err(_) => {
                    let _ = remove_dir_all(&output_dir);
                    return;
                }
            }
        }

        // Final layout verification step before running full native pass block
        if cancel_flag.load(Ordering::SeqCst) {
            let _ = remove_dir_all(&output_dir);
            let _ = window.emit("extraction-progress", ProgressPayload { percentage: 0 });
            return;
        }

        let mut final_source = match File::open(&path) {
            Ok(f) => f,
            Err(_) => return,
        };
        
        if compress_tools::uncompress_archive(&mut final_source, &output_dir, compress_tools::Ownership::Ignore).is_ok() {
            let _ = window.emit("extraction-progress", ProgressPayload { percentage: 100 });
        }
    });

    Ok(output_dir_clone.to_string_lossy().into_owned())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // ✨ Register our shared cancellation token mapping configuration state to the Tauri core container
        .manage(ExtractionState {
            should_cancel: Arc::new(AtomicBool::new(false)),
        })
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![open_browser, extract_archive, cancel_extraction])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}