# N-Body Simulation

This project implements a basic simulation of the gravitational interaction between multiple bodies (or particles), using Newton's law of gravitation, with toggleable collision detection. 

Written in JavaScript using HTML5 Canvas. 

## Usage

Hosted on [GitHub Pages](https://tolmdyn.github.io/nbody/)

## Implementation Details

The forces are calculated directly between each particle without any simplifications, for this reason performance will suffer for a large amount of particles, with a complexity of $O^2 . This could be remedied by adopting the [Barnes-Hut](https://en.wikipedia.org/wiki/Barnes%E2%80%93Hut_simulation) algorithm.

