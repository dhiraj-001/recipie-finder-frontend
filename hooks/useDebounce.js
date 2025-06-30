import {useState, useEffect} from 'react'

export function useDebounce(value,delay){
  const [debounceVal, setDebaounceVal] = useState(value)

  useEffect(()=>{
    
    const handler = setTimeout(() => {
      setDebaounceVal(value)
    }, delay);

    return () => clearTimeout(handler)

  },[value,delay])

  return debounceVal
}