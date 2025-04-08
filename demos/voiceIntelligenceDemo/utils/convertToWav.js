const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const { PassThrough, Readable } = require('stream');

ffmpeg.setFfmpegPath(ffmpegPath);

/**
 * Convert an MP4 file provided as a Buffer/ArrayBuffer into a WAV file Buffer.
 *
 * @param {Buffer} inputBuffer - The MP4 file data.
 * @returns {Promise<Buffer>} - A promise that resolves to a Buffer containing the WAV file data.
 */
function convertToWav(inputBuffer) {
  return new Promise((resolve, reject) => {
    // Create a readable stream from the input buffer.
    const inputStream = new Readable({
      read() {} // This is a no-op _read function.
    });
    inputStream.push(Buffer.from(inputBuffer));
    inputStream.push(null); // Signal the end of the stream.

    // Create a PassThrough stream for capturing ffmpeg output.
    const outputStream = new PassThrough();
    const chunks = [];

    // Collect data chunks from the output stream.
    outputStream.on('data', chunk => chunks.push(chunk));
    outputStream.on('error', err => reject(err));
    outputStream.on('end', () => resolve(Buffer.concat(chunks)));

    // Configure ffmpeg:
    ffmpeg(inputStream)
      .noVideo()                   // Remove video; we only want audio.
      .audioCodec('pcm_s16le')     // Standard codec for WAV files.
      .audioChannels(1)            // Change to 2 for stereo if needed.
      .audioFrequency(44100)       // CD quality sample rate.
      .format('wav')
      .on('error', err => reject(err))
      .pipe(outputStream, { end: true });
  });
}

module.exports = { convertToWav };