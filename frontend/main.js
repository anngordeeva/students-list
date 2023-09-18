// функция добавления студента на сервер
async function serverAddSudent(obj) {
	let response = await fetch('http://localhost:3000/api/students', {
			method: "POST",
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(obj),
	})

	let data = await response.json()

	return data
}

// получение массива студентов с сервера
let serverData = async function serverGetSudents() {
	let response = await fetch('http://localhost:3000/api/students', {
			method: "GET",
			headers: { 'Content-Type': 'application/json' }
	})

	let data = await response.json()

	return data
}

async function serverDeleteSudent(id) {
	let response = await fetch('http://localhost:3000/api/students/' + id, {
			method: "DELETE",
	})

	let data = await response.json()

	return data
}
// // массив студентов 
let studentsList = []


async function renderStudentsAfterGet() {
	const students = await serverData()
	renderStudentsTable(students)
	studentsList = students
}

renderStudentsAfterGet()
/*let studentsList = [
	{
		name: 'Анна',
		surname: 'Иванова',
		lastname: 'Сергеевна',
		birthday: '03.10.1991',
		studyStart: 2023,
		faculty: 'Архитектура',
	},
	{
		name: 'Татьяна',
		surname: 'Петрова',
		lastname: 'Игоревна',
		birthday: '10.12.1995',
		studyStart: 2014,
		faculty: 'Информатика',
	},
	{
		name: 'Анастасия',
		surname: 'Грачева',
		lastname: 'Ильинична',
		birthday: '01.12.2000',
		studyStart: 2018,
		faculty: 'Графический дизайн',
	},
	{
		name: 'Степан',
		surname: 'Панов',
		lastname: 'Павлович',
		birthday: '11.11.1998',
		studyStart: 2022,
		faculty: 'Информатика',
	},
	{
		name: 'Иван',
		surname: 'Тимофеев',
		lastname: 'Анатольевич',
		birthday: '05.03.1990',
		studyStart: 2016,
		faculty: 'Архитектура',
	}
]*/

let sortItem = 'fullName',
	sortItemDirection = true;

// создаем таблицу
const wrapper = document.getElementById('wrapper')

const table = document.createElement('table'),
	tableHead = document.createElement('thead'),
	tableHeadRow = document.createElement('tr'),
	tableHeadColomFullName = document.createElement('th'),
	tableHeadColomFaculty = document.createElement('th'),
	tableHeadColomAge = document.createElement('th'),
	tableHeadColomYear = document.createElement('th'),
	tableBody = document.createElement('tbody'),

	filterForm = document.getElementById('filter__form'),
	filterName = document.getElementById('filter-name'),
	filterFaculty = document.getElementById('filter-faculty'),
	filterAge = document.getElementById('filter-age'),
	filterYear = document.getElementById('filter-year');

tableHeadColomFullName.setAttribute('id', 'fullName')
tableHeadColomFaculty.setAttribute('id', 'tableHeadfaculty')
tableHeadColomAge.setAttribute('id', 'age')
tableHeadColomYear.setAttribute('id', 'tableHeadYear')

wrapper.append(table)
table.append(tableHead)

tableHead.append(tableHeadRow)
tableHeadRow.append(tableHeadColomFullName)
tableHeadRow.append(tableHeadColomFaculty)
tableHeadRow.append(tableHeadColomAge)
tableHeadRow.append(tableHeadColomYear)

tableHeadColomFullName.textContent = 'Ф. И. О. студента'
tableHeadColomFaculty.textContent = 'Факультет'
tableHeadColomAge.textContent = 'Дата рождения'
tableHeadColomYear.textContent = 'Года обучения'

table.append(tableBody)

// функция для создания нового студента
function getStudentItem(studentObj) {
	const tableBodyRow = document.createElement('tr'),
		tableHeadColomFullName = document.createElement('td'),
		tableHeadColomFaculty = document.createElement('td'),
		tableHeadColomAge = document.createElement('td'),
		tableHeadColomYear = document.createElement('td'),
		tableHeadColomDelite = document.createElement('td'),
		btnDelite = document.createElement('button');

	tableHeadColomDelite.classList.add('td-delite')
	btnDelite.classList.add('btn-delite')
	btnDelite.textContent = "Удалить"

	tableBodyRow.append(tableHeadColomFullName)
	tableBodyRow.append(tableHeadColomFaculty)
	tableBodyRow.append(tableHeadColomAge)
	tableBodyRow.append(tableHeadColomYear)
	tableBodyRow.append(tableHeadColomDelite)

	tableHeadColomDelite.append(btnDelite)

	tableHeadColomFullName.textContent = studentObj.fullName
	tableHeadColomFaculty.textContent = studentObj.faculty
	tableHeadColomAge.textContent = `${studentObj.birthday} (${studentObj.age} лет)`
	tableHeadColomYear.textContent = studentObj.study

	

	btnDelite.addEventListener('click', async function() {
		console.log(studentObj.id)
		await serverDeleteSudent(studentObj.id)
		tableBodyRow.remove()
	})

	return tableBodyRow;
}

// функция отрисовки всех студентов
function renderStudentsTable(studentArray) {

	console.log(studentArray)
	tableBody.innerHTML = '';

	for (const studentObj of studentArray) {
		studentObj.fullName = `${studentObj.surname} ${studentObj.name} ${studentObj.lastname}`;
		studentObj.age = ((new Date().getTime() - new Date(studentObj.birthday)) / (24 * 3600 * 365.25 * 1000)) | 0;
		if (Number(studentObj.studyStart) + 4 < new Date().getFullYear()) {
			studentObj.study = `${Number(studentObj.studyStart)} - ${(Number(studentObj.studyStart) + 4)} (Закончил)`
		} else if (studentObj.studyStart + 4 > new Date().getFullYear()) {
			studentObj.study = `${Number(studentObj.studyStart)} - ${Number(studentObj.studyStart) + 4} (${(new Date().getFullYear() - Number(studentObj.studyStart)) + 1} курс)`
		}
	}
	// сортировка

	studentsList = studentsList.sort(function (a, b) {

		let sort = a[sortItem] < b[sortItem]

		if (sortItemDirection == false) sort = a[sortItem] > b[sortItem]
		if (sort) return -1
	})
	
	for (const studentObj of studentArray) {
		const newTableBodyRow = getStudentItem(studentObj)
		tableBody.append(newTableBodyRow)
	}
}


renderStudentsTable(studentsList)

// кнопка для добавления новго студента
const btnAdd = document.createElement('button')
btnAdd.classList.add('btn__add')

btnAdd.textContent = 'Добавить студента'
wrapper.append(btnAdd)

btnAdd.addEventListener('click', function () {
	const popup = document.getElementById('popup')

	popup.classList.remove('hidden')
	wrapper.classList.add('wrapper__bg')
})

// валидация формы
function validation(form) {

	function createError(input, text) {
		const parent = input.parentNode,
			errorLabel = document.createElement('span');

		errorLabel.classList.add('error__text')
		errorLabel.textContent = text

		parent.classList.add('error')
		parent.append(errorLabel)
	}

	function removeError(input) {
		const parent = input.parentNode;

		if (parent.classList.contains('error')) {
			parent.querySelector('.error__text').remove()
			parent.classList.remove('error')
		}
	}

	let result = true;


	form.querySelectorAll('input').forEach(input => {
		if (input.value == '') {
			createError(input, 'Поле не заполнено')
			result = false
		} else removeError(input)
	});

	return result
}

// форма добавления студента
const form = document.getElementById('form'),
	inputName = document.getElementById('name'),
	inputSurmane = document.getElementById('surmane'),
	inputFamilyName = document.getElementById('family-name'),
	inputBirth = document.getElementById('birth'),
	inputYear = document.getElementById('year'),
	inputFaculty = document.getElementById('faculty'),
	buttonClose = document.getElementById('btn__back');

form.addEventListener('submit', async function (event) {
	event.preventDefault();

	if (validation(this) == true) {

		let objectStudent = ({
			name: inputName.value,
			surname: inputSurmane.value,
			lastname: inputFamilyName.value,
			birthday: new Date(inputBirth.value).toLocaleDateString(),
			studyStart: Number(inputYear.value),
			faculty: inputFaculty.value,
		})

		let serverDataObj = await serverAddSudent(objectStudent)

		studentsList.push(serverDataObj)
		event.target.reset();

		const popup = document.getElementById('popup')

		popup.classList.add('hidden')
		wrapper.classList.remove('wrapper__bg')
	};

	buttonClose.addEventListener('click', function () {
		const popup = document.getElementById('popup')

		popup.classList.add('hidden')
		wrapper.classList.remove('wrapper__bg')
	})
	renderStudentsTable(studentsList)
})

// собития сортировки

document.getElementById('fullName').addEventListener('click', function () {
	sortItem = 'fullName'
	sortItemDirection = !sortItemDirection
	renderStudentsTable(studentsList)
})

document.getElementById('tableHeadfaculty').addEventListener('click', function () {
	sortItem = 'faculty'
	sortItemDirection = !sortItemDirection
	renderStudentsTable(studentsList)
})

document.getElementById('age').addEventListener('click', function () {
	sortItem = 'age'
	sortItemDirection = !sortItemDirection
	renderStudentsTable(studentsList)
})

document.getElementById('tableHeadYear').addEventListener('click', function () {
	sortItem = 'study'
	sortItemDirection = !sortItemDirection
	renderStudentsTable(studentsList)
})

// функция фильтрации массива студентов
filterForm.addEventListener('submit', function (event) {
	event.preventDefault();
})


function filter(fieldName, input) {
	let filteredStudentList = studentsList;

	if(input.value !== '') {
		filteredStudentList = studentsList.filter(function(studentObj) {
			return studentObj[fieldName].toLowerCase().includes(input.value.toLowerCase())
		})
	}
	return filteredStudentList
}

filterName.addEventListener('input', function() {
	renderStudentsTable(filter('fullName', filterName));
})

filterFaculty.addEventListener('input', function() {
	renderStudentsTable(filter('faculty', filterFaculty));
})

filterAge.addEventListener('input', function() {
	renderStudentsTable(filter('birthDate', filterAge));
})

filterYear.addEventListener('input', function() {
	renderStudentsTable(filter('study', filterYear));
})