import SiteMenuView from "./view/site-menu.js";
import FilterView from "./view/filter.js";
import BoardView from "./view/board.js";
import SortView from "./view/sort.js";
import TaskEditView from "./view/task-edit.js";
import TaskListView from "./view/task-list.js";
import TaskView from "./view/task.js";
import LoadMoreButtonView from "./view/load-more-button.js";
import NoTaskView from "./view/no-task.js";
import {generateTask} from "./mock/task.js";
import {generateFilter} from "./mock/filter.js";
import {render, RenderPosition} from "./utils.js";

const TASK_COUNT = 22;
const TASK_COUNT_PER_STEP = 8;

const tasks = new Array(TASK_COUNT).fill().map(generateTask);
const filters = generateFilter(tasks);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const renderTask = (taskListComponent, task) => {
  const taskComponent = new TaskView(task);
  const taskEditComponent = new TaskEditView(task);

  const replaceCardToFrom = () => {
    taskListComponent.replaceChild(taskEditComponent.getElement, taskComponent.getElement);
  };

  const replaceFormToCard = () => {
    taskListComponent.replaceChild(taskComponent.getElement, taskEditComponent.getElement);
  };

  taskComponent.getElement.querySelector(`.card__btn--edit`).addEventListener(`click`, () => {
    replaceCardToFrom();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  taskEditComponent.getElement.querySelector(`form`).addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceFormToCard();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceFormToCard();
    }
  };

  render(taskListComponent, taskComponent.getElement, RenderPosition.BEFOREEND);
};

const renderBoard = (boardContainer, boardTasks) => {
  const boardComponent = new BoardView();
  const taskListComponent = new TaskListView();

  render(boardContainer, boardComponent.getElement, RenderPosition.BEFOREEND);
  render(boardComponent.getElement, taskListComponent.getElement, RenderPosition.BEFOREEND);
  if (boardTasks.every((task) => task.isArchive)) {
    render(boardComponent.getElement, new NoTaskView().getElement, RenderPosition.BEFOREEND);
  } else {
    render(boardComponent.getElement, new SortView().getElement, RenderPosition.BEFOREEND);
    render(boardComponent.getElement, taskListComponent.getElement, RenderPosition.BEFOREEND);

    for (let i = 0; i < Math.min(tasks.length, TASK_COUNT_PER_STEP); i++) {
      renderTask(taskListComponent.getElement, tasks[i]);
    }

    if (boardTasks.length > TASK_COUNT_PER_STEP) {
      let renderedTaskCount = TASK_COUNT_PER_STEP;

      const loadMoreButtonComponent = new LoadMoreButtonView();
      render(boardComponent.getElement, loadMoreButtonComponent.getElement, RenderPosition.BEFOREEND);
      loadMoreButtonComponent.getElement.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        boardTasks
          .slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
          .forEach((task) => render(taskListComponent.getElement, new TaskView(task).getElement, RenderPosition.BEFOREEND));
        renderedTaskCount += TASK_COUNT_PER_STEP;
        if (renderedTaskCount >= tasks.length) {
          loadMoreButtonComponent.getElement.remove();
          loadMoreButtonComponent.removeElement();
        }
      });
    }
  }
};

render(siteHeaderElement, new SiteMenuView().getElement, RenderPosition.BEFOREEND);
render(siteMainElement, new FilterView(filters).getElement, RenderPosition.BEFOREEND);

renderBoard(siteMainElement, tasks);

