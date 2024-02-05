import { useEffect, useState } from 'react'
import { BloomFilter } from 'bloom-filters'

const useBloomFilter = (jsonFilePath: string) => {
    interface BloomFilterState {
        bloomFilter: BloomFilter | null;
        isLoading: boolean;
        error: any;
    }

    const [state, setState] = useState<BloomFilterState>({
        bloomFilter: null,
        isLoading: true,
        error: null
    });

    useEffect(() => {
        fetch(jsonFilePath)
            .then(response => response.json())
            .then(json => {
                setState({
                    bloomFilter: BloomFilter.fromJSON(json),
                    isLoading: false,
                    error: null
                })
            })
            .catch(error => {
                setState({
                    bloomFilter: null,
                    isLoading: false,
                    error
                })
            })
    }, []);

    return state;
};

export default useBloomFilter