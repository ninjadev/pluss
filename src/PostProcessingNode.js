(function(global) {
  class PostProcessingNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        tDiffuse: new NIN.TextureInput(),
      };
      super(id, options);

      this.paperTexture = Loader.loadTexture("res/paper.jpg");
      this.paperTexture.wrapS = this.paperTexture.wrapT = THREE.RepeatWrapping;
    }

    warmup(renderer) {
      this.ctx.update(8226);
      this.ctx.render(renderer);
    }

    update(frame) {
      this.uniforms.frame.value = frame;
      this.uniforms.tDiffuse.value = this.inputs.tDiffuse.getValue();
      this.uniforms.paperTexture.value = this.paperTexture;
    }
  }

  global.PostProcessingNode = PostProcessingNode;
})(this);
