export const graphicBar = {
  type: 'bar',
  data: {
    labels: ['Drama', 'Comedy', 'Action', 'Romance', 'Horror', 'Sci-Fi'],
    datasets: [
      {
        label: 'Votes',
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        data: [12, 19, 3, 5, 2, 3],
        tension: 0.1,
        borderWidth: 1,
        _id: '667aa69cc3eb290c991e0908',
      },
    ],
  },
};

export const graphicLine = {
  type: 'line',
  data: {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Eduard',
        backgroundColor: ['rgb(255, 99, 132)'],
        borderColor: ['rgb(255, 99, 132)'],
        data: [0, 10, 5, 2, 20, 30, 45],
        tension: 0.1,
        borderWidth: 1,
        _id: '667aa707c3eb290c991e090e',
      },
      {
        label: 'Maria',
        backgroundColor: ['rgb(30, 233, 99)'],
        borderColor: ['rgb(30, 233, 99)'],
        data: [0, 2, 20, 15, 25, 30, 40],
        tension: 0.1,
        borderWidth: 1,
        _id: '667aa707c3eb290c991e090f',
      },
      {
        label: 'John',
        backgroundColor: ['rgb(255, 206, 86)'],
        borderColor: ['rgb(255, 206, 86)'],
        data: [0, 2, 20, 10, 40, 15, 25],
        tension: 0.1,
        borderWidth: 1,
        _id: '667aa707c3eb290c991e0910',
      },
      {
        label: 'Alex',
        backgroundColor: ['rgb(75, 192, 192)'],
        borderColor: ['rgb(75, 192, 192)'],
        data: [8, 16, 33, 48, 22, 40, 25],
        tension: 0.1,
        borderWidth: 1,
        _id: '667aa707c3eb290c991e0911',
      },
      {
        label: 'Peter',
        backgroundColor: ['rgb(153, 102, 255)'],
        borderColor: ['rgb(153, 102, 255)'],
        data: [4, 10, 7, 29, 35, 24, 10],
        tension: 0.1,
        borderWidth: 1,
        _id: '667aa707c3eb290c991e0912',
      },
    ],
    _id: '667aa707c3eb290c991e090d',
  },
};
