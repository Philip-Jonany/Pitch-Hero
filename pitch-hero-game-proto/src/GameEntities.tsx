export class GameEntity {
  name: string;  
  x: number;
  y: number;

  constructor(name: string, x: number, y: number) {
    this.name = name;
    this.x = x;
    this.y = y;
  }

  setX(x: number) {
    this.x = x;
  }

  setY(y: number) {
    this.y = y;
  }

  tick(dt: number) { }

  draw(dt: number, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) { }

  shouldRemove(): boolean { return false; }
}

export class PlayerEntity extends GameEntity {
  getInputFunc: () => number;

  constructor(getInputFunc: () => number) {
    super("player", 5, 50);
    this.getInputFunc = getInputFunc;
  }

  tick(dt: number) { 
    this.setY(this.getInputFunc());
  }

  draw(dt: number, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    const rectWidth = 10;
    const rectHeight = 10;
    let blockX = (this.x / 100.0) * canvas.width;
    let blockY = (1 - this.y / 100.0) * canvas.height;

    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.fillRect(blockX - rectWidth / 2, blockY - rectHeight / 2, rectWidth, rectHeight);
  }
}

export class PipeEntity extends GameEntity {
  
  width: number;
  gap: number;

  constructor(y: number, width: number, gap: number) {
    super("pipe", 110, y);
    this.width = width;
    this.gap = gap;
  }

  tick(dt: number) { 
    // this.setY(this.getInputFunc());
    this.setX(this.x - dt * 10);
  }

  draw(dt: number, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    // canvas space from game space
    let x = (this.x / 100.0) * canvas.width;
    let y = (1 - this.y / 100.0) * canvas.height;
    let width = (this.width / 100.0) * canvas.width;
    let gap = (this.gap / 100.0) * canvas.height;

    ctx.fillStyle = "green";

    // top
    ctx.beginPath();
    ctx.fillRect(x - width / 2, 0, width, y - gap / 2);

    ctx.fillRect(x - width / 2, y + gap / 2, width, canvas.height);
  }

  shouldRemove(): boolean {
    return this.x < -10;
  }

  inDangerZone(x: number, y: number): boolean {
    let leftEdge = this.x - this.width / 2;
    let rightEdge = this.x + this.width / 2;
    let topLip = this.y + this.gap / 2;
    let bottomLip = this.y - this.gap / 2;
    return x > leftEdge && x < rightEdge && (y > topLip || y < bottomLip);
  }
}