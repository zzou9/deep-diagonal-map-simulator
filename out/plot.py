import matplotlib.pyplot as plt
import math

# Step 1: Read the numbers from the file
filename = 'coord_dist.txt'
numbers = []

with open(filename, 'r') as file:
    for line in file:
        try:
            number = float(line.strip())
            numbers.append(number)
        except ValueError:
            print(f"Skipping invalid line: {line.strip()}")

# Step 2: Plot the numbers against their indices
indices = list(range(1, len(numbers) + 1))

plt.figure(figsize=(10, 5))
plt.plot(indices, numbers, marker='o', linestyle='-', color='b', markersize=1)
plt.xlabel('Iterations')
plt.ylabel('l_2 distance (log scale)')
plt.title('Log Distance to Original Polygon')
plt.grid(True)
plt.show()