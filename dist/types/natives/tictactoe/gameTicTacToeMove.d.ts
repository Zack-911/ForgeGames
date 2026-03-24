import { ArgType, NativeFunction } from '@tryforge/forgescript';
declare const _default: NativeFunction<[{
    name: string;
    description: string;
    type: ArgType.Guild;
    required: true;
    rest: false;
}, {
    name: string;
    description: string;
    type: ArgType.Channel;
    required: true;
    rest: false;
}, {
    name: string;
    description: string;
    type: ArgType.Number;
    required: true;
    rest: false;
}, {
    name: string;
    description: string;
    type: ArgType.User;
    required: false;
    rest: false;
}], true>;
export default _default;
