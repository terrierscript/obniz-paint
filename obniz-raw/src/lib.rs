use js_sys::Array;
use wasm_bindgen::prelude::*;
use std::borrow::Borrow;

fn wrap(x: Result<JsValue,JsValue>) -> Option<u8>{
    return match x.ok() {
        Some(xx) => match xx.as_f64() {
            Some(xxx) => Some(xxx as u8),
            None => None,
        },
        None => None
    };
}
fn jsv_to_vec(v: Array) -> Vec<u8> {
    let vv : Vec<u8> = v
        .values()
        .into_iter()
        .map(|x| match wrap(x) {
            Some(xx) => xx,
            None => panic!("")
        })
        .collect();
    return vv
}

fn arr_to_dim(v: Array) -> Vec<u8> {   
    return v
        .values()
        .into_iter()
        .map(|x| match x.ok() {
            Some(xx) => {
                
                let a = jsv_to_vec(xx.into());
                return a.chunks(8)
                    .map(|b|  chunk_to_bin(b ));
            }
            None => panic!(""),
        })
        .flatten()
        .collect();
}


fn log(message: String) {
    web_sys::console::log_1(&format!("[koreha rust dayo~~] {}", message).into());
}

fn arr_to_bin(varr: Vec<Vec<u8>>) -> Vec<u8> {
    return varr
        .iter()
        .map(|bits| bits.chunks(8).map(|b| chunk_to_bin(b)))
        .flatten()
        .collect();
}


fn chunk_to_bin_opt(slice: Vec<Option<u8>>) -> u8 {
    let z : Vec<u8> = slice.iter().map(|c| c.unwrap()).collect();
    return chunk_to_bin(z.as_slice());
}

fn chunk_to_bin(slice: &[u8]) -> u8 {
    slice
        .iter()
        .rev()
        .enumerate()
        .fold(0, |acc, (i, &b)| acc + (b * 2u8.pow(i as u32)))
}

#[wasm_bindgen]
pub fn main(v: Array) -> Vec<u8> {
    // web_sys::console::log_1(;
    let varr = arr_to_dim(v);
    // let result = arr_to_bin(varr);
    return varr;
}

#[test]
// fn it_works() {
//     let v: Vec<u8> = vec![1, 0, 1, 0, 1];
//     let test_case: Uint8Array = v.into();
// }
#[test]
fn chunk_to_bin_test_1() {
    let test = &[1];
    let result = chunk_to_bin(test);
    assert_eq!(1, result);
}

#[test]
fn chunk_to_bin_test_2() {
    let test = &[1, 0];
    let result = chunk_to_bin(test);
    assert_eq!(2, result);
}

#[test]
fn chunk_to_bin_test_1_2() {
    let test = &[0, 1];
    let result = chunk_to_bin(test);
    assert_eq!(1, result);
}

#[test]
fn chunk_to_bin_test_170() {
    let test = &[1, 0, 1, 0, 1, 0, 1, 0];
    let result = chunk_to_bin(test);
    assert_eq!(170, result);
}

// fn chunk() {
//     let test : Vec<u32> = vec![0, 1, 1, 0];
//     let result: Vec<Vec<u32>> = test.chunks(2).map(|c| Vec::new(c) ).collect();
//     assert_eq!(vec![0, 1], result[0]);
//     assert_eq!(vec![1, 0], result[1]);
// }
