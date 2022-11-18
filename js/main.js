/* eslint-disable no-useless-concat */
/* eslint-disable no-use-before-define */
/* eslint-disable max-len */
(() => {
  let studentsList = [
    {
      name: 'Алексей', surname: 'антошкин', middlename: 'Александрович', birthday: new Date('1993, 11, 9'), yearStudy: 2020, faculty: 'Факультет филологический',
    },
    {
      name: 'Валерия', surname: 'Гоготова', middlename: 'Александровна', birthday: new Date('1991, 11, 8'), yearStudy: 2020, faculty: 'Факультет журналистики',
    },
    {
      name: 'Степан', surname: 'Карамов', middlename: 'Геннадьевич', birthday: new Date('1992, 11, 7'), yearStudy: 2021, faculty: 'Факультет психологии',
    },
    {
      name: 'Андрей', surname: 'Чугунов', middlename: 'Игоревич', birthday: new Date('1996, 11, 8'), yearStudy: 2022, faculty: 'Факультет социологии',
    },
    {
      name: 'Никита', surname: 'Ягло', middlename: 'Георгиевич', birthday: new Date('1995, 11, 21'), yearStudy: 2018, faculty: 'Факультет исторический',
    },
    {
      name: 'Алексей', surname: 'Антошкин', middlename: 'Борисович', birthday: new Date('1995, 11, 17'), yearStudy: 2015, faculty: 'факультет информатики',
    },
  ];

  const currentDate = new Date();

  function generateError(text) {
    const error = document.createElement('div');
    error.className = 'error';
    error.innerHTML = text;
    return error;
  }

  function removeError(form) {
    const errors = form.querySelectorAll('.error');
    for (const eror of errors) {
      if (eror.tagName === 'DIV') {
        eror.remove();
      } else {
        eror.classList.remove('error');
      }
    }
  }

  function validateForm(form) {
    removeError(form);

    for (const input of form.querySelectorAll('input')) {
      if (!input.value) {
        input.parentElement.insertBefore(generateError('Заполните поле'), input.nextSibling);
        input.classList.add('error');
      } else if (input.type === 'date') {
        const endDateRange = new Date(currentDate.getFullYear() - 18, currentDate.getMonth(), currentDate.getDate(), 24);
        const startDateRange = new Date('1900, 01, 01');
        const inputDate = new Date(input.value);

        if ((inputDate < startDateRange || inputDate > endDateRange)) {
          input.classList.add('error');
          input.parentElement.insertBefore(generateError(`Дата рождения должна быть от 01.01.1900 до ${endDateRange.getDate()}.${endDateRange.getMonth() + 1}.${endDateRange.getFullYear()}`), input.nextSibling);
        }
      } else if (input.name === 'studentYearStudy') {
        const maxYear = currentDate.getFullYear();
        const minYear = 2000;

        if (input.value < minYear || input.value > maxYear) {
          input.classList.add('error');
          input.parentElement.insertBefore(generateError(`Год обучения должен быть от 2000 до ${maxYear}`), input.nextSibling);
        }
      }
    }
  }

  function createFormElemetns(wrapperHeader, wrapperType, inputsParam) {
    const formWrapper = document.createElement('div');
    const formHeader = document.createElement('h2');
    const form = document.createElement(wrapperType);

    for (const inputElement of inputsParam) {
      const input = document.createElement('input');
      const inputWrapper = document.createElement('div');
      input.name = inputElement.name;
      input.placeholder = inputElement.placeholder;
      input.setAttribute('type', inputElement.type);
      input.classList.add('form-control');
      inputWrapper.classList.add('form-group', 'col-md-6');
      inputWrapper.append(input);
      form.append(inputWrapper);
    }

    formWrapper.classList.add('row', 'form-row');

    formHeader.textContent = wrapperHeader;
    formHeader.classList.add('col-md-12');

    form.classList.add('form-row', 'col-md-12');

    formWrapper.append(formHeader);

    if (wrapperType === 'form') {
      const successBox = document.createElement('div');
      successBox.classList.add('success-feedback');
      const button = document.createElement('button');
      button.classList.add('btn', 'btn-primary');
      button.textContent = wrapperHeader;
      form.append(successBox);
      form.append(button);
    }

    formWrapper.append(form);

    return {
      formWrapper,
      form,
    };
  }

  function createForm() {
    const createdForm = createFormElemetns('Добавить студентов', 'form',
      [
        {
          name: 'studentSurname', placeholder: 'Фамилия', type: 'text',
        },
        {
          name: 'studentName', placeholder: 'Имя', type: 'text',
        },
        {
          name: 'studentMiddlename', placeholder: 'Отчество', type: 'text',
        },
        {
          name: 'studentBirthday', placeholder: 'Дата рождения', type: 'date',
        },
        {
          name: 'studentYearStudy', placeholder: 'Год начала обучения', type: 'number',
        },
        {
          name: 'studentFaculty', placeholder: 'Факультет', type: 'text',
        },
      ]);

    createdForm.form.addEventListener('submit', (evt) => {
      evt.preventDefault();
      validateForm(createdForm.form);

      const inputWithError = createdForm.form.querySelectorAll('input.error');
      const statusMessages = createdForm.form.querySelector('.success-feedback');

      if (inputWithError.length === 0) {
        statusMessages.innerHTML = 'Студент успешно добавлен';
        statusMessages.style.display = 'block';
        statusMessages.style.color = 'green';

        studentsList.push({
          name: createdForm.form.querySelector('[name="studentName"]').value,
          surname: createdForm.form.querySelector('[name="studentSurname"]').value,
          middlename: createdForm.form.querySelector('[name="studentMiddlename"]').value,
          birthday: new Date(createdForm.form.querySelector('[name="studentBirthday"]').value),
          yearStudy: createdForm.form.querySelector('[name="studentYearStudy"]').value,
          faculty: createdForm.form.querySelector('[name="studentFaculty"]').value,
        });

        createTable(studentsList);
        createdForm.form.reset();
      }
    });

    for (const input of createdForm.form.querySelectorAll('input')) {
      input.addEventListener('input', () => {
        validateForm(createdForm.form);
      });
    }

    return createdForm.formWrapper;
  }

  function createTable(students) {
    const table = document.createElement('table');
    const tableThWrap = document.createElement('thead');
    const tableTh = ['ФИО студента', 'Факультет', 'Дата рождения', 'Годы-обучения'];
    const tableBody = document.createElement('tbody');

    for (const head of tableTh) {
      const tableThItem = document.createElement('th');
      tableThItem.textContent = head;
      tableThWrap.append(tableThItem);
      tableThItem.addEventListener('click', (evt) => {
        sortTable(evt, students);
      });
    }

    for (const student of students) {
      const tableRow = document.createElement('tr');
      tableBody.append(tableRow);

      for (let i = 1; i <= tableTh.length; i++) {
        const tableCellItem = document.createElement('td');
        if (i === 1) {
          tableCellItem.textContent = `${student.surname} ` + `${student.name} ` + `${student.middlename}`;
        } else if (i === 2) {
          tableCellItem.textContent = student.faculty;
        } else if (i === 3) {
          const birthdayDate = student.birthday;
          tableCellItem.textContent = `${birthdayDate.getDate()}.` + `${birthdayDate.getMonth() + 1}.` + `${birthdayDate.getFullYear()}` + ` (${calculateAge(birthdayDate)})`;
        } else if (i === 4) {
          tableCellItem.textContent = calculateCourse(student.yearStudy);
        }
        tableRow.append(tableCellItem);
      }
    }

    table.append(tableThWrap);
    table.append(tableBody);
    table.classList.add('table', 'table-striped', 'table-bordered', 'table-responsive-xl');

    if (document.querySelector('table')) {
      document.querySelector('table').remove();
    }
    document.querySelector('#students-block').prepend(table);
  }

  function sortTable(evt, students) {
    const clickedHead = evt.target.innerText;
    const studentToSort = [...students];

    if (clickedHead === 'ФИО студента') {
      studentToSort.sort((a, b) => (a.surname.toLowerCase() + a.name.toLowerCase() + a.middlename.toLowerCase() > b.surname.toLowerCase() + b.name.toLowerCase() + b.middlename.toLowerCase() ? 1 : -1));
    }

    if (clickedHead === 'Факультет') {
      studentToSort.sort((a, b) => (a.faculty.toLowerCase() > b.faculty.toLowerCase() ? 1 : -1));
    }

    if (clickedHead === 'Дата рождения') {
      studentToSort.sort((a, b) => (a.birthday > b.birthday ? -1 : 1));
    }

    if (clickedHead === 'Годы-обучения') {
      studentToSort.sort((a, b) => (a.yearStudy > b.yearStudy ? 1 : -1));
    }

    createTable(studentToSort);
  }

  function transformWord(value) {
    const valueEnd = value % 10;
    let wordEnd = '';

    if (value >= 10 && value <= 20) {
      wordEnd = `${value} лет`;
    }

    if (valueEnd === 1) {
      wordEnd = `${value} год`;
    }

    if (valueEnd >= 2 && valueEnd <= 4) {
      wordEnd = `${value} года`;
    }

    if ((valueEnd >= 5 && valueEnd <= 9) || valueEnd === 0) {
      wordEnd = `${value} лет`;
    }

    return wordEnd;
  }

  function calculateAge(birthdayDate) {
    let fullAge = currentDate.getFullYear() - birthdayDate.getFullYear();
    const birthCurrent = new Date(currentDate.getFullYear(), birthdayDate.getMonth(), birthdayDate.getDate());

    if (currentDate < birthCurrent) {
      fullAge--;
    }

    return transformWord(fullAge);
  }

  function calculateCourse(startYear) {
    const endDate = new Date(parseInt(startYear, 10) + 4, 8, 30);
    let yearsStudy = currentDate.getFullYear() - startYear;
    let course = '';

    if (currentDate > endDate) {
      course = '(закончил)';
    } else {
      course = (currentDate.getMonth() > 8 || yearsStudy === 0) ? `(${++yearsStudy} курс)` : `(${yearsStudy} курс)`;
    }

    return `${startYear}-` + `${endDate.getFullYear()} ` + `${course}`;
  }

  function addFilter() {
    const createdFilters = createFormElemetns('Выбрать студентов', 'div',
      [
        {
          name: 'filterFio', placeholder: 'По ФИО', type: 'text',
        },
        {
          name: 'filterFaculty', placeholder: 'По факультету', type: 'text',
        },
        {
          name: 'filterStartStudy', placeholder: 'По году начала обучения', type: 'text',
        },
        {
          name: 'filterEndStudy', placeholder: 'По году окончания обучения', type: 'text',
        },
      ]);

    createdFilters.formWrapper.addEventListener('input', () => {
      let copyArrays = [...studentsList];
      createdFilters.formWrapper.querySelectorAll('input').forEach((inp) => {
        if (inp.value !== '') {
          copyArrays = filterArray(copyArrays, inp.name, inp.value);
        }
        createTable(copyArrays);
      });
    });

    return createdFilters.formWrapper;
  }

  function filterArray(array, property, value) {
    let filterArr = [];
    for (const item of array) {
      if (property === 'filterFio' && String(`${item.surname.toLocaleLowerCase()} ${item.name.toLocaleLowerCase()} ${item.middlename.toLocaleLowerCase()}`).includes(value.toLocaleLowerCase()) === true) {
        filterArr.push(item);
      }
      if (property === 'filterFaculty' && String(item.faculty.toLocaleLowerCase()).includes(value.toLocaleLowerCase()) === true) {
        filterArr.push(item);
      }
      if (property === 'filterStartStudy' && parseInt(item.yearStudy, 10) === parseInt(value, 10)) {
        filterArr.push(item);
      }
      if (property === 'filterEndStudy' && parseInt(item.yearStudy, 10) === parseInt(value - 4, 10)) {
        filterArr.push(item);
      }
    }
    return filterArr;
  }

  function startAppstudents(container) {
    createTable(studentsList);
    document.querySelector('#filter-block').append(addFilter());
    container.append(createForm());
  }

  window.startAppstudents = startAppstudents;
})();
