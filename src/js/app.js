import TaskList from './tasklist';

const taskList = new TaskList();
if (typeof localStorage !== 'undefined') {
  if (localStorage.tasks === undefined) {
    taskList.tasks.save({
      todo: ['Вымыть посуду', 'Убраться в комнате', 'Отнести документы в банк'],
      inprogress: ['Сделать диплом', 'Найти подрядчика для строительства забора', 'Выполнить домашнее задание 6.1', 'Выполнить домашнее задание 6.2'],
      done: ['Подать данные счетчиков', 'Выполнить домашнее задание 5.1', 'Выполнить домашнее задание 5.2'],
    });
  }
}
taskList.init();
