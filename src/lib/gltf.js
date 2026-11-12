import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js'

// The models are meshopt-compressed GLBs served from Supabase Storage, which
// are about a quarter of the size of the original glTF files and decode in a
// few ms.
export function createGltfLoader() {
    const loader = new GLTFLoader()
    loader.setMeshoptDecoder(MeshoptDecoder)
    return loader
}
