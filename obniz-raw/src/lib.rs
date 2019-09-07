use js_sys::Array;
use wasm_bindgen::prelude::*;
fn jsv_to_vec(v: Array) -> Vec<u8> {
    return v
        .values()
        .into_iter()
        .map(|x| {
            return match x.ok() {
                Some(xx) => match xx.as_f64() {
                    Some(xxx) => xxx as u8,
                    None => panic!(""),
                },
                None => panic!(""),
            };
        })
        .collect();
}

fn jsvalue_to_arr(jsvalue: JsValue) -> Array {
    return jsvalue.into();
}

fn arr_to_vec(xx: JsValue) -> Vec<u8> {
    let arr = jsvalue_to_arr(xx);
    return jsv_to_vec(arr);
}
fn arr_to_dim(v: Array) -> Vec<Vec<u8>> {
    return v
        .values()
        .into_iter()
        .map(|x| {
            return match x.ok() {
                Some(xx) => arr_to_vec(xx),
                None => panic!(""),
            };
        })
        .collect();
}

#[wasm_bindgen]
pub fn main(v: Array) -> Vec<u8> {
    // web_sys::console::log_1(;
    let varr = arr_to_dim(v);
    let result = arr_to_bin(varr);
    return result;
}

fn log(message: String) {
    web_sys::console::log_1(&format!("[koreha rust dayo~~] {}", message).into());
}

fn arr_to_bin(varr: Vec<Vec<u8>>) -> Vec<u8> {
    return varr
        .iter()
        .map(|bits| {
            // log(format!("koreha rust dayo--{:?} {:?}", bits.len(), bits));
            bits.chunks(8).map(|b| chunk_to_bin(b))
        })
        .flatten()
        .collect();
}

fn chunk_to_bin(slice: &[u8]) -> u8 {
    slice
        .iter()
        .rev()
        .enumerate()
        .fold(0, |acc, (i, &b)| acc + (b * 2u8.pow(i as u32)))
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
