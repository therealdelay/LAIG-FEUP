/**
 * MyGraphNode class, representing an intermediate node in the scene graph.
 * @constructor
**/
function MyGraphNode(graph, nodeID) {
    this.graph = graph;

    this.nodeID = nodeID;
    
    // IDs of child nodes.
    this.children = [];

    // IDs of child nodes.
    this.leaves = [];

    // The material ID.
    this.materialID = null ;

    // The texture ID.
    this.textureID = null ;

    // Selectable
    this.selectable = false;

    // The animation of node
    this.currAnimation = null;

    // Time of animation
    this.startTime = 0;

    // Transformations matrix
    this.transformMatrix = mat4.create();
    mat4.identity(this.transformMatrix);

    // Animation Matrix
    this.animationMatrix = mat4.create();
    mat4.identity(this.animationMatrix);
}

/**
 * Adds the reference (ID) of another node to this node's children array.
 */
MyGraphNode.prototype.addChild = function(nodeID) {
    this.children.push(nodeID);
}

/**
 * Adds a leaf to this node's leaves array.
 */
MyGraphNode.prototype.addLeaf = function(leaf) {
    this.leaves.push(leaf);
}

/**
 * Get the matrix for animation for each node
 * @param  currTime 
 */
MyGraphNode.prototype.update = function(currTime){
    // First time
    if(this.startTime == 0){
        this.startTime = currTime;
        return;
    }

    let deltaTime = currTime - this.startTime;
    if(this.currAnimation != null){
        this.animationMatrix = this.graph.getAnimation(this.currAnimation).getMatrix(deltaTime);
    }

    this.startTime = currTime;
};