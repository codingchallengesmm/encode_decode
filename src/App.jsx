import { useState, useMemo } from 'react'
import './App.css'

const encodingMap = {
  binary: '01',
  base64: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
  burmese: '၀၁၂၃၄၅၆၇၈၉',
  hexadecimal: '0123456789ABCDEF',
  octal: '01234567',

}


Number.prototype.toStringCustom = function(strmap) {
  let s = '';
  let num = this;

  while (num >= strmap.length) {
    s = strmap[Math.floor(num % strmap.length)] + s;
    num = Math.floor(num / strmap.length);
  }

  s = strmap[num] + s

  return s
}

Number.fromStringCustom = function(str, strmap) {
  let chars = str.split('')

  let n = 0

  while (chars.length > 0) {
    n *= strmap.length

    let ch = chars.splice(0, 1)
    let i = strmap.indexOf(ch)

    if (i !== -1) {
      n += i
    } else {
      return new Number(-1)
    }
  }

  return new Number(n)
}

const decoders = {
  binary: (str) => { return str !== undefined ? Number.fromStringCustom(str, encodingMap.binary).toString() : 'err' },
  octal: (str) => { return str !== undefined ? Number.fromStringCustom(str, encodingMap.octal).toString() : 'err' },
  hexadecimal: (str) => { return str !== undefined ? Number.fromStringCustom(str, encodingMap.hexadecimal).toString() : 'err' },
  base64: (str) => { return str !== undefined ? Number.fromStringCustom(str, encodingMap.base64).toString() : 'err' },
  burmese: (str) => { return str !== undefined ? Number.fromStringCustom(str, encodingMap.burmese).toString() : 'err' },
}


function App() {

  const [number, setNumber] = useState(0)

  const [decodeStr, setDecodeStr] = useState('')
  const [decoder, setDecoder] = useState('binary')
  const [output, setOutput] = useState(0)

  const [binaryPadding, setBinaryPadding] = useState(false)
  const [showNumbers, setShowNumbers] = useState(false)

  useMemo(() => {
    setOutput(decoders[decoder]?.call(this, decodeStr))
  }, [decodeStr, decoder])

  return (
    <>
      <h1>controls</h1>

      <input type="checkbox" name="" id="padBinary" checked={binaryPadding} onChange={(e) => { setBinaryPadding(e.target.checked) }} />

      <label htmlFor="padBinary">
        pad binary
      </label>

      <h1>encoding</h1>

      <br />

      <h2>Input</h2>

      <input style={{ width: '100%' }} type="range" onChange={(e) => { setNumber(parseInt(e.target.value)) }}
        value={number}
        min="0"
        max="255" />

      <button onClick={() => setNumber((old) => parseInt(old / 2))}>&divide;2</button>
      <button onClick={() => setNumber((old) => old - 1)}>-1</button>

      <span style={{ padding: '8px' }}>
        <input type="number" name="" id="" value={number} onChange={e => setNumber(parseInt(e.target.value))} />
      </span>

      <button onClick={() => setNumber((old) => old + 1)}>+1</button>
      <button onClick={() => setNumber((old) => old * 2)}>&times;2</button>


      <h2>Output</h2>
      <table style={{ minWidth: '400px' }}>
        <thead>
          <tr>
            <th>format</th>
            <th>encoded</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              decimal
            </td>
            <td>
              {number}
            </td>
          </tr><tr>
            <td>
              binary
            </td>
            <td>
              <code>{Number(number).toStringCustom(encodingMap.binary).padStart(binaryPadding ? 8 : 0, '0')}</code>
            </td>
          </tr>
          <tr>
            <td>
              octal
            </td>
            <td>
              <code>{Number(number).toStringCustom(encodingMap.octal)}</code>
            </td>
          </tr>
          <tr>
            <td>
              hexadecimal
            </td>
            <td>
              <code>{Number(number).toStringCustom(encodingMap.hexadecimal).toUpperCase()}</code>
            </td>
          </tr>
          <tr>
            <td>
              base64
            </td>
            <td>
              <code>{Number(number).toStringCustom(encodingMap.base64)}</code>
            </td>
          </tr>
          <tr>
            <td>
              burmese
            </td>
            <td>
              <code>{Number(number).toStringCustom(encodingMap.burmese)}</code>
            </td>
          </tr>
        </tbody>
      </table>

      <h1>decoding</h1>

      <h2>decoder</h2>

      <select onChange={(e) => { setDecoder(e.target.value) }}>
        <option value="binary">binary</option>
        <option value="octal">octal</option>
        <option value="base64">base64</option>
        <option value="hexadecimal">hexadecimal</option>
        <option value="burmese">burmese</option>
      </select>

      <h2>input</h2>

      <input type="text" value={decodeStr} onChange={(e) => { setDecodeStr(e.target.value) }} style={{ fontSize: '1.3em', padding: '4px' }} />

      <button onClick={() => setDecodeStr('')}>Clear</button>

      <input id="show_numbers" type="checkbox" checked={showNumbers} onChange={e => setShowNumbers(e.target.checked)} />

      <label htmlFor="show_numbers">show numbers</label>

      <br />

      {encodingMap[decoder].split('').map((ch, i) => <button onClick={(e) => { setDecodeStr(old => old + ch) }}>{ch}{showNumbers && <span> ({i})</span>}</button>)}

      <table>
        <tr>
          <td>output (decimal)</td>
          <td>{output}</td>
        </tr>
        <tr>
          <td>output (binary)</td>
          <td><code>
            {Number(output).toStringCustom(encodingMap.binary).padStart(binaryPadding ? 8 : 0, '0')}
          </code></td>
        </tr>
      </table>

    </>
  )
}

export default App
