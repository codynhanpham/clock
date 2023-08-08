// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri::Window;

struct CurrentTime {
    yyyy: String,
    month_num: String,
    month_text_short: String,
    month_text_long: String,
    dd: String,
    day_short: String,
    day_long: String,
    hh: String,
    mm: String,
    ss: String,
    ms: String,
}

impl CurrentTime {
    fn update(&mut self) {
        let now = chrono::Local::now();
        self.yyyy = now.format("%Y").to_string();
        self.month_num = now.format("%m").to_string();
        self.month_text_short = now.format("%b").to_string();
        self.month_text_long = now.format("%B").to_string();
        self.dd = now.format("%d").to_string();
        self.day_short = now.format("%a").to_string();
        self.day_long = now.format("%A").to_string();
        self.hh = now.format("%H").to_string();
        self.mm = now.format("%M").to_string();
        self.ss = now.format("%S").to_string();
        self.ms = now.format("%3f").to_string();
    }

    fn format_string(&self) -> String {
        // time = hh:mm:ss
        // ms = ms
        // date = YYYY-MM-DD
        // date_long = day, Month DD, YYYY
        let time = format!("{}:{}:{}", self.hh, self.mm, self.ss);
        let ms = format!("{}", self.ms);
        let date = format!("{}-{}-{}", self.yyyy, self.month_num, self.dd);
        let date_long = format!("{}, {} {}, {}", self.day_long, self.month_text_short, self.dd, self.yyyy);

        // return as json
        format!("{{\"time\": \"{}\", \"ms\": \"{}\", \"date\": \"{}\", \"date_long\": \"{}\"}}", time, ms, date, date_long)
    }
}

#[tauri::command]
fn get_time() -> String {
    let mut time = CurrentTime {
        yyyy: String::new(),
        month_num: String::new(),
        month_text_short: String::new(),
        month_text_long: String::new(),
        dd: String::new(),
        day_short: String::new(),
        day_long: String::new(),
        hh: String::new(),
        mm: String::new(),
        ss: String::new(),
        ms: String::new(),
    };
    time.update();
    time.format_string()
}

#[tauri::command]
fn toggle_fullscreen(window: Window) {
    let is_fullscreen = window.is_fullscreen().unwrap();
    window.set_fullscreen(!is_fullscreen).unwrap();
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_time, toggle_fullscreen])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
