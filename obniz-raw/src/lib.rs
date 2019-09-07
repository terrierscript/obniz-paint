use js_sys::Array;
use wasm_bindgen::prelude::*;

fn wrap(x: Result<JsValue, JsValue>) -> Option<u8> {
    return x.ok()?.as_f64().and_then(|u| Some(u as u8));
}

fn byte_to_u8(slice: &[u8]) -> u8 {
    slice
        .into_iter()
        .rev()
        .enumerate()
        .fold(0, |acc, (i, b)| acc + (b * 2u8.pow(i as u32)))
}

fn jsv_to_chunkbin(arr: Array) -> Vec<u8> {
    let v: Vec<_> = arr
        .values()
        .into_iter()
        .map(|x| match wrap(x) {
            Some(xx) => xx,
            None => panic!(""),
        })
        .collect();
    return v.chunks(8).map(|b| byte_to_u8(b)).collect::<Vec<u8>>();
}

fn arr_to_dim(arr: Array) -> Vec<u8> {
    return arr
        .values()
        .into_iter()
        .map(|item| match item.ok() {
            Some(value) => jsv_to_chunkbin(value.into()),
            None => panic!(""),
        })
        .flatten()
        .collect();
}

fn log(message: String) {
    web_sys::console::log_1(&format!("[koreha rust dayo~~] {}", message).into());
}

#[wasm_bindgen]
pub fn main(v: Array) -> Vec<u8> {
    let varr = arr_to_dim(v);
    return varr;
}

#[test]
fn chunk_to_bin_test_1() {
    let test = &[1];
    let result = byte_to_u8(test);
    assert_eq!(1, result);
}

#[test]
fn chunk_to_bin_test_2() {
    let test = &[1, 0];
    let result = byte_to_u8(test);
    assert_eq!(2, result);
}

#[test]
fn chunk_to_bin_test_1_2() {
    let test = &[0, 1];
    let result = byte_to_u8(test);
    assert_eq!(1, result);
}

#[test]
fn chunk_to_bin_test_170() {
    let test = &[1, 0, 1, 0, 1, 0, 1, 0];
    let result = byte_to_u8(test);
    assert_eq!(170, result);
}
