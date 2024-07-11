# N-Body Simulation

This project implements a basic simulation of the gravitational interaction between multiple bodies (or particles), using [Newton's law of gravitation](https://en.wikipedia.org/wiki/Newton%27s_law_of_universal_gravitation), with toggleable collision detection. The values and dimension units are abstract and not meant to represent real values.

Written in JavaScript using HTML5 Canvas. 

## Usage

Hosted on [GitHub Pages](https://tolmdyn.github.io/nbody/)

The default initial state simulates a central static body with a stable smaller body and satellite in a circular orbit. The simulation can be reset, cleared, new bodies can be added and a random state of particles can be generated.

A circular orbit can be achieved using the orbital speed equation $v = \sqrt{\frac{GM}{r}}$ where G is the gravitational constant (scaled in this program to 0.1), M is the mass of the larger body and r is the radius of the orbit.

## Implementation Details

The forces are calculated directly between each particle using $F = G \frac{m_1 m_2}{r^2}$

As performance will suffer with a large amount of particles $O(n^2)$, the program could be extended using the [Barnes-Hut](https://en.wikipedia.org/wiki/Barnes%E2%80%93Hut_simulation) algorithm.

