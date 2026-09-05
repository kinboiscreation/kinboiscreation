import { Config } from "remotion";

// Video Rendering Configuration
Config.setVideoImageFormat("png");
Config.setCodec("h264");
Config.setFrameRange([0, 300]);

// Audio Configuration
Config.setAudioBitrate("192k");
Config.setAudioCodec("aac");

// Performance Configuration
Config.setConcurrency(4);
Config.setPixelFormat("yuv420p");

// Output configuration
Config.setOutputFormat("mp4");

// Logging
Config.setLogLevel("info");

export const COMP_NAME = "BlankCanvas";

export default undefined;
