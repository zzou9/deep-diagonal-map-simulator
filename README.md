# Deep Diagonal Map Simulator

An accompanying visualization program of **deep diagonal maps** acting on **closed and twisted polygons** for the [paper](https://arxiv.org/abs/2412.15561) "Spirals, Tic-Tac-Toe Partition, and Deep Diagonal Maps."

Click [here](https://zzou9.github.io/pentagram-map/spiral.html) to launch the program.

---

## User Manual

This user manual is designed for the **"spiral"** module of the program. The functions of the other modules are analogous.

### Keyboard Actions

- **SPACE**: Act the map on the polygon once.
- **A**: Start/pause the map animation.
- **W**: Toggle dragging of draggable panels.
- **E**: Increase rate (see "Rate" button in Coordinate panel).
- **Q**: Decrease rate (see "Rate" button in Coordinate panel).
- **Z**: Undo the previous action.
- **UP_ARROW**: Increase the periodicity constant (n).
- **DOWN_ARROW**: Decrease the periodicity constant (n).
- **LEFT_ARROW**: Increase the vertices to display.
- **RIGHT_ARROW**: Decrease the vertices to display.

---

### Panels Overview

There are three types of panels in the program, distinguished by their background colors:

- **Blue**: Control and interact with the program. Users can click the buttons in these panels to control the program.
- **Yellow**: Display quantitative information of the twisted polygon and is **not interactive**.
- **Purple**: Interactive. Users can drag the panels to change their position.

You can toggle the display/hiding of the blue and yellow panels by clicking on their names.

---

### Panel Details

#### 1. **Polygon Control Panel**

This panel controls the basic properties of the twisted polygon:

- **n**: Periodicity of the twisted polygon.
- **# vertices**: Number of vertices displayed.
- **Vertex Size**: Size of the vertices displayed.
- **Set Default**: Reset the shape of the twisted polygon back to a default twisted n-gon.
- **Rand. Type-Alpha 3-Spiral**: Generate a random type-alpha 3-spiral.
- **Rand. Type-Beta 3-Spiral**: Generate a random type-beta 3-spiral.
- **Rand. Type-Beta 2-Spiral**: Generate a random type-beta 2-spiral.
- **Drag**: Toggle dragging (see **Edit Shape Panel**).
- **Normalization**: Toggle the normalization applied to the image polygon under the map action. 
  - Square: normalizing the first four vertices to the vertices of a unit square, counter-clockwise direction. 
  - Triangle: normalizing the first four vertices to the vertices of a triangle and a vertex in the interior of the triangle. 

#### 2. **Coordinate Panel**

Modify the twisted polygon by changing its corner invariants. Press and hold the triangles to change the corner invariants.

- **Entries**: Swap the entries of the corner invariants to change them.
- **Rate**: Control how fast the corner invariants change when modified.

#### 3. **Action Panel**

Control the action of the map Tk on the twisted polygon.

- **Diagonal**: The value for *k*.
- **Spacing (optional)**: The number of diagonals to skip when intersecting them (for Tk, set spacing = 1).
- **Shifts (optional)**: Number of forward index shifts applied on the image polygon.
- **Speed**: The speed of the map action animation.
- **Power**: The power of the map applied to the polygon.
- **Start/Pause Action**: Start or pause the animation of the map acting on the twisted polygon.

#### 4. **Trajectories Panel**

Toggle the display of orbit projections of the twisted polygon.

- **Vertex**: The vertex to project.
- **Show/Hide Trajectory**: Click to show or hide the trajectory of the selected vertex.
  - The trajectory is obtained as follows: Let the map act on the polygon, then apply normalization and plot the position of the vertex.
- **# Iterations**: The number of iterations in the trajectory.
- **Traj. Size**: The size of the points displayed in the trajectory.

#### 5. **Info Panel**

Displays information about the twisted polygon:

- **Iteration**: The number of iterations applied to the twisted polygon.
- **x1, x2, ...**: The corner invariants of the twisted polygon.
- **F1, F2, ...**: The invariants F1, F2, F3, F4 from the paper.
- **Yk**: The invariant from the conjecture in Section 8.

#### 6. **Edit Shape Panel**

A draggable panel displaying a copy of the twisted polygon at the center of the screen. Users can modify the shape of the twisted polygons by dragging the colored vertices in this panel. **Note:** When the map acts on the twisted polygon, only the center one changes its shape; the one in the **Edit Shape Panel** does not change shape.

- **Dragging**: 
  - Position the mouse inside the panel and click "w" to toggle the frame color.
  - When the frame color is **green**, users can drag the mouse to move the center of the panel to the desired location.
  - When the frame color is **white**, the panel is not draggable, but users can still access the mouse functions within the panel.

- **Shape Editing**:
  - When the **"Drag"** option in the **Control Panel** is **"On"**, users can drag the vertices in this panel (colored red, green, blue, etc.).
  - **Warning**: When the **"Drag"** option is **"Off"** or the panel frame color is **green**, the vertices cannot be dragged.

---

### Additional Notes

- The program provides an interactive and intuitive environment to visualize the effects of deep diagonal maps on twisted polygons.
- Ensure the **Drag** feature is enabled in the **Control Panel** for editing the shape of the twisted polygon.
- The **Speed** and **Power** controls in the **Action Panel** allow you to fine-tune the animation of the map acting on the polygon.

---

Feel free to explore the features, and don't hesitate to experiment with the different parameters to gain a deeper understanding of deep diagonal maps and their behavior on twisted polygons.
