// 関数コンポーネント内で state を使えるようにするため、useState をインポート 
import React, { useState } from 'react'

const Counter = () => {
  // countの初期値として、1~10までのランダムな数値を生成
  const initialState = Math.floor(Math.random() * 10) + 1
  // count という名前の state 変数を宣言、初期値 initialState をセット
  const [count, setCount] = useState(initialState)
  // open という名前の state 変数を宣言、初期値 true をセット
  const [open, setOpen] = useState(true)
  // toggleの関数を宣言
  const toggle = () => setOpen(!open)

  function test(){
      console.log(count);
      
  }

  test();
  return (
    <>
      <button onClick={toggle}>{open ? 'close' : 'open'}</button>
      <div className={open ? 'isOpen' : 'isClose'}>
        <p>現在の数字は{count}です</p>
        {/* setCount()は、countを更新するための関数。countを引数で受け取ることも出来る */}
        <button onClick={() => setCount(prevState => prevState + 1)}>
          + 1
        </button>
        <button onClick={() => setCount(count - 1)}>- 1</button>
        <button onClick={() => setCount(0)}>０</button>
        <button onClick={() => setCount(initialState)}>最初の数値に戻す</button>
      </div>
    </>
  )
}

export default Counter