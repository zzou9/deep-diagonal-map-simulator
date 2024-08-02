import numpy as np

'''
A class that holds information of the twisted bigon
'''
class TwistedBigon:
    
    '''

    '''
    def __init__(self, x0: float, x1: float, x2: float, x3: float):
        # basic coordinate parameterization
        self.corner_coords = [x0, x1, x2, x3]

        # monodromy
        self.T = np.asarray([[1, 0, 0], [0, 1, 0], [0, 0, 1]])
        self.eigenvalues = [1, 1, 1]
        self.T_dual = np.asarray([[1, 0, 0], [0, 1, 0], [0, 0, 1]])
        
    def reconstruct():
        pass

    def apply_map(k, l):
        # TODO: write out the map
        vertices = []


        # // draw the old vertices
        # let vertices;
        # if (l > 3) {
        #     // use monodromy to draw vertices
        #     const v = Reconstruct.reconstruct3(coords);
        #     const M1 = Normalize.getProjectiveLift(v[0], v[1], v[2], v[3]);
        #     const M2 = Normalize.getProjectiveLift(v[2], v[3], v[4], v[5]);
        #     const M2Inv = MathHelper.invert3(M2);
        #     const T = MathHelper.matrixMult(M2Inv, M1);
        #     vertices = Reconstruct.reconstructBigon(T, k+l+6);
        # } else {
        #     // use formula to draw vertices (slow when number of vertices is large)
        #     vertices = Reconstruct.reconstruct3(coords, k+l+6);
        # }
        # // populate the new vertices
        # let imgVertices = new Array(6);
        # for (let i = 0; i < 6; i++) {
        #     // the numbering of the vertices follows from Schwartz's bird paper
        #     const v1 = vertices[i+k];
        #     const v2 = vertices[i+k+l];
        #     const v3 = vertices[i];
        #     const v4 = vertices[i+l];
        #     const vInt = Geometry.getIntersection(v1, v2, v3, v4);
        #     imgVertices[i] = vInt;
        # }
        # let tempCoords = Geometry.getCornerCoords(imgVertices);
        # let imgCoords = new Array(4);
        # if (k % 2 == 0) {
        #     imgCoords[0] = tempCoords[4];
        #     imgCoords[1] = tempCoords[5];
        #     imgCoords[2] = tempCoords[6];
        #     imgCoords[3] = tempCoords[7];
        # } else {
        #     imgCoords[0] = tempCoords[6];
        #     imgCoords[1] = tempCoords[7];
        #     imgCoords[2] = tempCoords[4];
        #     imgCoords[3] = tempCoords[5];
        # }

        # // check for errors 
        # for (let i = 0; i < 4; i++) {
        #     if (!Number.isFinite(imgCoords[i]) || Number.isNaN(imgCoords[i]) || imgCoords[i] == 0) {
        #         throw new Error("The image is at a singularity");
        #     } 
        # }
        
        # if (p == 1) {
        #     return imgCoords;
        # }

        # return this.applyMap(imgCoords, p-1);

        pass

    def is_degenerate():
        pass






