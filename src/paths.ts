import 'module-alias/register';
import { addAliases } from 'module-alias';
import { join } from "path";


addAliases({
    "@Database": join(__dirname, 'database'),
    "@Models": join(__dirname, 'database', 'models'),
    "@Config": join(__dirname, 'config'),
    "@Controllers": join(__dirname, 'controllers'),
    "@Repositories": join(__dirname, 'repositories'),
    "@Routes": join(__dirname, 'routes'),
    "@Shared": join(__dirname, 'shared'),
    "@Middlewares": join(__dirname, 'middlewares')
})
