/**
 * Remotion Configuration
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";

// Use Rspack for faster builds
Config.setRspack(true);

// Video output settings
Config.setVideoImageFormat("jpeg");
Config.setCodec("h264");
Config.setOverwriteOutput(true);

// Audio configuration
Config.setAudioBitrate("192k");
Config.setAudioCodec("aac");

// Performance
Config.setConcurrency(4);
Config.setPixelFormat("yuv420p");

// Logging
Config.setLogLevel("info");
