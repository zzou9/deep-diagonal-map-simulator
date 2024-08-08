import numpy as np

def is_linearly_independent(v1, v2, v3, v4, v5):
    '''
    Check whether five R^4 vectors are linearly independent.
    '''
    # first, cast to homogeneous coordinates of RP^4
    v1 = np.append(v1, 1)
    v2 = np.append(v2, 1)
    v3 = np.append(v3, 1)
    v4 = np.append(v4, 1)
    v5 = np.append(v5, 1)

    # next, calculate the determinant
    M = np.vstack([v1, v2, v3, v4, v5])
    

    # compute determinant to check linear dependence
    if np.linalg.det(M) == 0:
        return False
    return True

def find_ortho_comp_4(v1, v2, v3, v4):
    '''
    Given four linearly dependent vectors in R^4, find the vector orthogonal to 
    '''


if __name__ == '__main__':
    v1 = np.array([0.5, 0.5, 0.5, 0.5])
    v2 = np.array([0.5, 0.5, 0.6605, 0.5955])
    v3 = np.array([0.48695, 0.42543, 0.49147, 0.52758])
    v4 = np.array([0.48705, 0.42603, 0.64699, 0.63721])
    v5 = np.array([0.39584, 0.32213, 0.61506, 0.68348])

    print(np.linalg.det(np.vstack([v1, v3, v4, v5])))