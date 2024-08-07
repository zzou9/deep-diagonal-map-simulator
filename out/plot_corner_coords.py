import matplotlib.pyplot as plt
import numpy as np

# Step 1: Read the numbers from the file
filename = 'bdry_coords/T4_prime_bdry_5_coords_x0=0.5_x1=0.5'
coord_x2 = []
coord_x3 = []

# read values from file
with open(filename, 'r') as file:
    for line in file:
        try:
            coord = line.strip().split(',')
            coord_x2.append(float(coord[0]))
            coord_x3.append(float(coord[1]))
        except ValueError:
            print(f"Skipping invalid line: {line.strip()}")

coord_x2 = np.asarray(coord_x2)
coord_x3 = np.asarray(coord_x3)

# plot the original values
plt.figure(figsize=(10, 5))
plt.scatter(coord_x2, coord_x3, marker='o', s=5)

# Perform linear regression to find the best fit line
coeffs = np.polyfit(coord_x2, coord_x3, 1)  # 1 indicates a linear fit
linear_fit = np.poly1d(coeffs)

# Calculate slope and intercept
slope = coeffs[0]
intercept = coeffs[1]

# Create the equation text
equation_text = f'y = {slope:.2f}x + {intercept:.2f}'

# Plot the linear approximation
plt.plot(coord_x2, linear_fit(coord_x2), color='gray', linewidth=1, label='Linear Fit')

# Add the equation text to the plot
plt.text(0.55, 0.5, equation_text, fontsize=12, color='black')

plt.xlabel('x2 value')
plt.ylabel('x3 value')
plt.title('Boundary Coordinates for (5, 1) Map: x0=0.5, x1=0.5')
plt.grid(True)
plt.show()