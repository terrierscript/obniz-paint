use js_sys::Array;
use wasm_bindgen::prelude::*;

fn jsvalue_to_u8(x: Result<JsValue, JsValue>) -> Option<u8> {
    x.ok()?.as_f64().and_then(|u| Some(u as u8))
}

fn byte_to_u8(slice: &[u8]) -> u8 {
    slice.into_iter().fold(0, |acc, &b| (acc << 1) + b as u8)
}

fn vec_to_u8(vec: Vec<u8>) -> Vec<u8> {
    vec.chunks(8).map(|b| byte_to_u8(b)).collect()
}

fn array_to_vec(arr: Array) -> Vec<u8> {
    arr.values()
        .into_iter()
        .map(|x| jsvalue_to_u8(x).unwrap())
        .collect()
}

fn bin_to_raw(arr: Array) -> Vec<u8> {
    return arr
        .values()
        .into_iter()
        .map(|row| array_to_vec(row.unwrap().into()))
        .map(|vec| vec_to_u8(vec))
        .flatten()
        .collect();
}

fn log(message: String) {
    web_sys::console::log_1(&format!("[koreha rust dayo~~] {}", message).into());
}

#[wasm_bindgen]
pub fn main(v: Array) -> Vec<u8> {
    let varr = bin_to_raw(v);
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
