export class Coin {
    constructor(x, y, context) {
      this.x = x;
      this.y = y;
      this.context = context;
      this.radius = Math.random() * 5 + 5;
      this.coinImage = new Image();
      this.coinImage.onload = () => {
        // Изображение загружено, можно рисовать
      };
      this.coinImage.src = 'img/reefcoin.png'; // Путь к вашему изображению монетки
      this.rotation = 0; // Угол вращения монетки
      this.rotationSpeed = 0.1; // Скорость вращения монетки
    }
  
    draw() {
      this.context.save();
      this.context.translate(this.x, this.y);
      this.context.rotate(this.rotation);
      this.context.translate(-this.x, -this.y);
      // Рисуем изображение монетки
      this.context.drawImage(this.coinImage, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
      this.context.restore();
    }
  
    update() {
      this.draw();
      // Изменяем угол вращения на каждом кадре анимации
      this.rotation += this.rotationSpeed;
      // Переворачиваем направление вращения, если достигли 180 градусов
      if (this.rotation >= Math.PI / 2 || this.rotation <= -Math.PI / 2) {
        this.rotationSpeed *= -1;
      }
    }
  }