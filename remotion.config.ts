import {Config} from 'remotion';

Config.setVideoImageFormat('png');
Config.setCodec('h264');
Config.setCrf(18);
Config.setPixelFormat('yuv420p');
Config.setFrameRange([0, 1199]);
