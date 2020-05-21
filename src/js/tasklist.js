import Tasks from './tasks';

export default class TaskList {
  constructor() {
    if (typeof document !== 'undefined') {
      this.todo = document.querySelector('#todo .item-tasks');
      this.inprogress = document.querySelector('#inprogress .item-tasks');
      this.done = document.querySelector('#done .item-tasks');
      this.container = document.querySelector('.container');
    }
    this.tasks = new Tasks();
    this.dnd = null;
    this.ghost = null;
    this.dndWidth = null;
    this.dndHeight = null;
    this.dndTop = null;
    this.dndLeft = null;
  }

  init() {
    if (typeof document !== 'undefined') {
      document.addEventListener('DOMContentLoaded', () => {
        const tasks = this.tasks.load();
        this.addAll(this.todo, tasks.todo);
        this.addAll(this.inprogress, tasks.inprogress);
        this.addAll(this.done, tasks.done);
      });

      this.container.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('add-task')) {
          e.target.parentNode.querySelector('.input-task').classList.remove('hidden');
          e.target.classList.add('hidden');
        }
        if (e.target.classList.contains('add-task-button')) {
          this.add(e.target.closest('.tasks').querySelector('.item-tasks'),
            e.target.closest('.input-task').querySelector('.text-task').value);
          e.target.closest('.input-task').querySelector('.text-task').value = '';
          e.target.closest('.tasks').querySelector('.add-task').classList.remove('hidden');
          e.target.parentNode.classList.add('hidden');
          this.tasks.save(this.getAllTasks());
        }
        if (e.target.classList.contains('cancel')) {
          e.target.closest('.tasks').querySelector('.add-task').classList.remove('hidden');
          e.target.parentNode.classList.add('hidden');
        }
        if (e.target.classList.contains('del')) {
          this.del(e.target.parentNode);
          this.tasks.save(this.getAllTasks());
        }
        if (e.target.classList.contains('item-task')) {
          e.preventDefault();
          e.target.querySelector('.del').classList.add('hidden');
          this.dnd = e.target;
          this.dndWidth = this.dnd.offsetWidth;
          this.dndHeight = this.dnd.offsetHeight;
          this.dndLeft = e.pageX - e.target.getBoundingClientRect().left;
          this.dndTop = e.pageY - e.target.getBoundingClientRect().top;

          this.ghost = e.target.cloneNode(true);
          this.ghost.innerHTML = '';
          this.ghost.style.backgroundColor = 'white';
          this.ghost.style.width = `${this.dndWidth}px`;
          this.ghost.style.height = `${this.dndHeight}px`;

          this.dnd.classList.add('dragged');
          e.target.parentNode.insertBefore(this.ghost, e.target.nextElementSibling);

          this.dnd.style.left = `${e.pageX - this.dndLeft}px`;
          this.dnd.style.top = `${e.pageY - this.dndTop}px`;
          this.dnd.style.width = `${this.dndWidth}px`;
          this.dnd.style.height = `${this.dndHeight}px`;
        }
      });

      this.container.addEventListener('mousemove', (e) => {
        if (!this.dnd) return;
        e.preventDefault();
        this.dragAndDrop(e, this.ghost);
        this.dnd.style.left = `${e.pageX - this.dndLeft}px`;
        this.dnd.style.top = `${e.pageY - this.dndTop}px`;
      });

      this.container.addEventListener('mouseleave', (e) => {
        if (!this.dnd) return;
        e.preventDefault();
        this.ghost.parentNode.removeChild(this.ghost);
        this.dnd.classList.remove('gragged');
        this.dnd.style = '';
        this.dnd = null;
        this.ghost = null;
      });

      this.container.addEventListener('mouseup', (e) => {
        if (!this.dnd) return;
        this.dragAndDrop(e, this.dnd);
        this.ghost.parentNode.removeChild(this.ghost);
        this.dnd.classList.remove('dragged');
        this.dnd.style = '';
        this.dnd = null;
        this.ghost = null;

        this.tasks.save(this.getAllTasks());
      });
    }
  }

  getAllTasks() {
    if (typeof document !== 'undefined') {
      const all = {
        todo: [],
        inprogress: [],
        done: [],
      };
      const todo = Array.from(document.getElementById('todo').querySelector('.item-tasks').childNodes);
      const inprogress = Array.from(document.getElementById('inprogress').querySelector('.item-tasks').childNodes);
      const done = Array.from(document.getElementById('done').querySelector('.item-tasks').childNodes);
      todo.forEach((item) => all.todo.push(item.textContent.replace('✖', '')));
      inprogress.forEach((item) => all.inprogress.push(item.textContent.replace('✖', '')));
      done.forEach((item) => all.done.push(item.textContent.replace('✖', '')));
      return all;
    }
  }

  add(parent, text) {
    if (typeof document !== 'undefined') {
      const item = document.createElement('div');
      item.classList.add('item-task');
      item.innerHTML = `${text} <div class="del hidden">&#x2716;</div>`;
      parent.appendChild(item);
    }
  }

  addAll(parent, arr) {
    arr.forEach((item) => this.add(parent, item));
  }

  del(element) {
    element.parentNode.removeChild(element);
  }

  dragAndDrop(e, element) {
    if (typeof document !== 'undefined') {
      const closest = document.elementFromPoint(e.clientX, e.clientY);
      const { top } = closest.getBoundingClientRect();

      if (closest.classList.contains('item-task')) {
        if (e.pageY > window.scrollY + top + closest.offsetHeight / 2) {
          closest.closest('.item-tasks').insertBefore(element, closest.nextElementSibling);
        } else {
          closest.closest('.item-tasks').insertBefore(element, closest);
        }
      } else if (closest.classList.contains('item-tasks') && !closest.querySelector('.item-task')) {
        closest.append(element);
      }
    }
  }
}
