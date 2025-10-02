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

class Addon {

    static #MUTATION_OBSERVER_CONFIG = {
        attributes: true,
        childList: true,
        subtree: true
    };

    #knownVideoWalls;

    constructor() {
        this.#knownVideoWalls = [];
    }

    #addVideoWall(node) {
        YouTube.requireVideoWall(node);
        if (this.#knownVideoWalls.indexOf(node) !== -1) {
            return; /* already accounted for */
        }

        node.addEventListener("mouseenter", (event) => {
            Sounds.play_ui_menu_focus();
        });
        node.addEventListener("click", (event) => {
            Sounds.play_ui_menu_accept();
        });

        this.#knownVideoWalls.push(node);
    }

    #addVideoWalls() {
        for (const node of YouTube.getVideoWallElements()) {
            this.#addVideoWall(node);
        }
    }

    #handleEndscreenMutation(mutation) {
        if (mutation.attributeName !== "style") {
            return; /* visibility unchanged */
        }

        const endscreen = mutation.target;
        const endscreenDisplay = endscreen.style.display;

        let isVisible = false;
        if (!endscreenDisplay) {
            isVisible = true; /* default is inline */
        } else if(endscreenDisplay === "none") {
            isVisible = false;
        }

        /*
         * There used to be a check if the end screen was already
         * visible before actually playing anything. But the field
         * responsible for this would become desynchronized. I have
         * no idea what caused it. The purpose of the check was to
         * prevent the sound from playing more than once. But this
         * does not seem to occur when it's not present.
         */
        if(isVisible) {
            Sounds.play_ui_menu_flip_multi();
        }
    }

    #handleMutation(mutation) {
        const endscreen = YouTube.getEndScreen();
        if (endscreen && mutation.target === endscreen) {
            this.#handleEndscreenMutation(mutation);
        }

        for (const node of mutation.addedNodes) {
            if(YouTube.isVideoWall(node)) {
                this.#addVideoWall(node);
            }
        }
    }

    #observeMoviePlayer() {
        /*
         * Sometimes the movie player won't be available in time
         * when this extension is loaded. Using an interval gives
         * the sight more time to load without causing the addon
         * to crash and burn.
         */
        const observeInterval = setInterval(() => {
            const moviePlayer = YouTube.getMoviePlayer();
            if (!moviePlayer) {
                return; /* nothing to observe yet */
            }

            const observer = new MutationObserver((mutations, _) => {
                for (const mutation of mutations) {
                    this.#handleMutation(mutation);
                }
            });

            observer.observe(
                moviePlayer,
                Addon.#MUTATION_OBSERVER_CONFIG
            );

            clearInterval(observeInterval);
        }, 100);
    }

    init() {
        /*
         * The call to addVideoWalls() is made here in case there are
         * any video walls already present (and therefore, would not be
         * caught by the observer).
         */
        this.#addVideoWalls();
        this.#observeMoviePlayer();
    }

}

const addon = new Addon();
addon.init();
