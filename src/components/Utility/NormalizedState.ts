import { v4 as uuidv4 } from 'uuid';

/**
 * Base type for normalized dictionaries
 */
export type NormalizedDictionary<T> = {
    byId: { [id: string]: T; }
    allIds: string[]
}




export const ANormalized = {
    create<T>(): NormalizedDictionary<T> {
        return {
            byId: {},
            allIds: []
        }
    },


    /**
     * Adds a value to a normalized dictionary
     * 
     * @param dict the normalized dictionary
     * @param value the value to add
     */
    add: <T>(dict: NormalizedDictionary<T>, value: T): string => {
        const handle = uuidv4()

        dict.byId[handle] = value
        dict.allIds.push(handle)

        return handle
    },


    /**
     * Deletes a value by ref from the normalized dictionary
     * 
     * @param dict the normalized dictionary
     * @param value the value to remove
     */
    deleteByRef: <T>(dict: NormalizedDictionary<T>, value: T): string => {
        const entry = Object.entries(dict.byId).find(([key, val]) => val === value)

        if (entry === undefined) {
            throw Error(`ANormalized.deleteByRef was called but the ref was not in the dictionary. This should never happen and suggests that the API was used wrong.`)
        }

        const handle = entry[0]

        delete dict.byId[handle]
        dict.allIds.splice(dict.allIds.indexOf(handle), 1)

        return handle
    },


    /**
     * Deletes a value by handle from the normalized dictionary
     * 
     * @param dict the normalized dictionary
     * @param value the value to remove
     */
    delete: <T>(dict: NormalizedDictionary<T>, handle: string): string => {
        if (!(handle in dict.byId) || !dict.allIds.includes(handle)) {
            throw Error(`ANormalized.delete was called but the handle was not in the dictionary. This should never happen and suggests that the API was used wrong.`)
        }

        delete dict.byId[handle]
        dict.allIds.splice(dict.allIds.indexOf(handle), 1)

        return handle
    },


    get: <T>(dict: NormalizedDictionary<T>, handle: string) => {
        if (!(handle in dict.byId)) {
            throw Error(`ANormalized.get was called but the handle was not in the dictionary. This should never happen and suggests that the API was used wrong.`)
        }

        return dict.byId[handle]
    },


    entries: <T>(dict: NormalizedDictionary<T>) => {
        return Object.entries(dict.byId)
    },



    forEach: <T>(dict: NormalizedDictionary<T>, callbackfn: (value: [string, T]) => void) => {
        return dict.allIds.forEach(id => callbackfn([id, dict.byId[id]]))
    }
}