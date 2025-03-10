import {useEffect, useState} from "react";

const useFetch = <T>(fetchFunction: () => Promise<T>, autoFetch = true) => {
    const [data, setData] = useState<T | null>(null)
    const [error, setError] = useState<Error | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const fetchData = async () => {
        try {
            setLoading(true)
            setError(null)
            const res = await fetchFunction()
            setData(res)
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Something went wrong"))
        } finally {
            setLoading(true)
        }
    }

    const reset = () => {
        setData(null)
        setError(null)
        setLoading(false)
    }

    useEffect(()=>{
        if(autoFetch) { fetchData() }
    },[])

    return {data, error, loading, refetch: fetchData(), reset}
}

export default useFetch;