//Sólo en caso de retrocompatibilidad
//import.meta.url aunque da error en el editor, no lo da en Node.
import { createRequireFromPath } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

export default function(metaURL) {
    const require = createRequireFromPath(metaURL);
    const __filename = fileURLToPath(metaURL);
    const __dirname = dirname(__filename);
    return { require, __filename, __dirname };
}