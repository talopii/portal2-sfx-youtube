/*
 * MIT License
 *
 * Copyright (c) 2025 Talop B. Foxielock
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
"use strict";

class YouTube {

    static #MOVIE_PLAYER = "movie_player";
    static #VIDEO_WALL_ENDSCREEN = "videowall-endscreen";
    static #VIDEO_WALL_CLASS = "ytp-videowall-still";
    static #VIDEO_STREAM = "video-stream";

    static #requireNode(node) {
        if (!node) {
            throw new Error("node cannot be null");
        } else if (!(node instanceof Node)) {
            throw new Error("node must be of type Node");
        }
    }

    static getMoviePlayer(node = document) {
        YouTube.#requireNode(node);
        return node.getElementById(YouTube.#MOVIE_PLAYER);
    }

    static getEndScreen(node = document) {
        YouTube.#requireNode(node);

        let endscreens = node.getElementsByClassName(YouTube.#VIDEO_WALL_ENDSCREEN);
        if (!endscreens) {
            return null;
        } else if (endscreens.length > 1) {
            console.warn("Multiple ${YouTube.#VIDEO_WALL_ENDSCREEN} elements");
        }

        return endscreens[0];
    }

    static isVideoWall(elem) {
        if (!elem) {
            return false; /* elem must be specified */
        } else if (!(elem instanceof Element)) {
            return false; /* elem must be an element */
        }
        return elem.classList.contains(YouTube.#VIDEO_WALL_CLASS);
    }

    static requireVideoWall(elem) {
        if (!elem) {
            throw new Error("elem cannot be null");
        } else if (!(elem instanceof Element)) {
            throw new Error("elem must be of type Element");
        } else if(!elem.classList.contains(YouTube.#VIDEO_WALL_CLASS)) {
            throw new Error("elem is not a ${YouTube.#VIDEO_WALL_CLASS}");
        }
    }

    static getVideoWallElements(node = document) {
        YouTube.#requireNode(node);
        return node.getElementsByClassName(YouTube.#VIDEO_WALL_CLASS);
    }

    static getVideoStream(node = document) {
        let videoStreams = node.getElementsByClassName(YouTube.#VIDEO_STREAM);
        if (!videoStreams) {
            return null;
        } else if (videoStreams.length > 1) {
            console.warn("Multiple ${YouTube.#VIDEO_STREAM} elements");
        }
        return videoStreams[0];
    }

    static getVolume(node = document) {
        let video = YouTube.getVideoStream(node);
        if (!video) {
            return 1.0;
        } else if (video.muted) {
            return 0.0;
        }
        return video.volume;
    }

}
