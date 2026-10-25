import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js'

// The models in /public/models are meshopt-compressed GLBs, which are about a
// quarter of the size of the original glTF files and decode in a few ms.
export function createGltfLoader() {
    const loader = new GLTFLoader()
    loader.setMeshoptDecoder(MeshoptDecoder)
    return loader
}
