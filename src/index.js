const quoteList = document.querySelector('#quote-list')
const quoteForm = document.querySelector('#new-quote-form')

function renderQuote(quote) {
  const li = document.createElement('li')
  li.classList.add('quote-card')

  const blockquote = document.createElement('blockquote')
  blockquote.classList.add('blockquote')

  const p = document.createElement('p')
  p.classList.add('mb-0')
  p.textContent = quote.quote

  const footer = document.createElement('footer')
  footer.classList.add('blockquote-footer')
  footer.textContent = quote.author

  const br = document.createElement('br')

  const likeButton = document.createElement('button')
  likeButton.classList.add('btn-success')
  likeButton.innerHTML = `Likes: <span>${quote.likes.length}</span>`
  likeButton.addEventListener('click', () => {
    fetch('http://localhost:3000/likes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quoteId: quote.id,
      }),
    })
    .then(response => response.json())
    .then(newLike => {
      quote.likes.push(newLike)
      likeButton.innerHTML = `Likes: <span>${quote.likes.length}</span>`
    })
  })

  const deleteButton = document.createElement('button')
  deleteButton.classList.add('btn-danger')
  deleteButton.textContent = 'Delete'
  deleteButton.addEventListener('click', () => {
    fetch(`http://localhost:3000/quotes/${quote.id}`, {
      method: 'DELETE',
    })
    .then(() => li.remove())
  })

  blockquote.appendChild(p)
  blockquote.appendChild(footer)
  blockquote.appendChild(br)
  blockquote.appendChild(likeButton)
  blockquote.appendChild(deleteButton)

  li.appendChild(blockquote)
  quoteList.appendChild(li)
}

function renderQuotes(quotes) {
  quoteList.innerHTML = ''
  quotes.forEach(quote => {
    renderQuote(quote)
  })
}

function fetchQuotes() {
  fetch('http://localhost:3000/quotes?_embed=likes')
  .then(response => response.json())
  .then(renderQuotes)
}

function createQuote(quote, author) {
  fetch('http://localhost:3000/quotes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      quote,
      author,
    }),
  })
  .then(response => response.json())
  .then(quote => {
    renderQuote(quote)
  })
}

quoteForm.addEventListener('submit', event => {
  event.preventDefault()
  const quote = event.target.elements['quote'].value
  const author = event.target.elements['author'].value
  createQuote(quote, author)
})

fetchQuotes()
