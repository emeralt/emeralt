var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import ava from 'ava';
import { resolve } from 'path';
export const test = (msg, cb) => {
    // @ts-ignore
    const createPlugin = Object.values(require(resolve(process.cwd(), 'src/index.ts'))).find((t) => typeof t === 'function');
    return ava.serial(msg, (t) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield cb(t, createPlugin);
        }
        catch (error) {
            throw error;
        }
        finally {
            // cleanup
            // @ts-ignore
            const plugin = yield createPlugin({})({});
            yield plugin.dropData();
        }
    }));
};
