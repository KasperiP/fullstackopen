/* eslint-disable no-undef */
describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Testikäyttäjä',
      username: 'root',
      password: 'test123',
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
  })

  it('Login form is shown', function () {
    cy.visit('http://localhost:3000')
    cy.contains('Log in to application')
    cy.contains('login')
  })

  describe('Login', function () {
    it('Login fails with wrong credentials', function () {
      cy.visit('http://localhost:3000')
      cy.get('#username').type('wrongUsername')
      cy.get('#password').type('wrongPassword')
      cy.get('#loginBtn').click()

      cy.contains('wrong credentials')
    })

    it('Login success with right credentials', function () {
      cy.visit('http://localhost:3000')
      cy.get('#username').type('root')
      cy.get('#password').type('test123')
      cy.get('#loginBtn').click()

      cy.contains('Testikäyttäjä logged in')
    })

    describe('When logged in', function () {
      this.beforeEach(function () {
        cy.request('POST', 'http://localhost:3003/api/login', {
          username: 'root',
          password: 'test123',
        }).then((response) => {
          localStorage.setItem(
            'loggedBlogappUser',
            JSON.stringify(response.body)
          )
          cy.visit('http://localhost:3000')
        })
      })

      it('A blog can be created', function () {
        cy.contains('new blog').click()
        cy.get('#blogTitle').type('Testi title')
        cy.get('#blogAuthor').type('Testi author')
        cy.get('#blogUrl').type('Testi url')

        cy.get('#blogSubmitBtn').click()

        cy.contains('a new blog Testi title by Testi author added')
        cy.contains('Testi title')
        cy.contains('Testi author')
      })

      it('blog can be liked', function () {
        // create a blog
        cy.contains('new blog').click()
        cy.get('#blogTitle').type('Testi title')
        cy.get('#blogAuthor').type('Testi author')
        cy.get('#blogUrl').type('Testi url')

        cy.get('#blogSubmitBtn').click()

        cy.contains('a new blog Testi title by Testi author added')
        cy.contains('Testi title')
        cy.contains('Testi author')

        // like the blog
        cy.contains('view').click()
        cy.contains('like').click()
        cy.contains('blog Testi title by Testi author liked')
      })

      it('blog can be deleted', function () {
        // create a blog
        cy.addBlog({
          title: 'Testi title 1',
          author: 'root',
          url: 'Testi url 1',
          likes: 1,
        })

        cy.addBlog({
          title: 'Testi title 2',
          author: 'root',
          url: 'Testi url 2',
          likes: 1,
        })

        // delete the blog
        cy.contains('view').click()
        cy.contains('remove').click()

        cy.visit('http://localhost:3000')

        cy.contains('Testi title 1').should('not.exist')
      })

      it('blogs are sorted by likes', function () {
        cy.addBlog({
          title: 'Testi title 1',
          author: 'Testi author 1',
          url: 'Testi url 1',
          likes: 1,
        })
        cy.addBlog({
          title: 'Testi title 2',
          author: 'Testi author 2',
          url: 'Testi url 1',
          likes: 4,
        })
        cy.addBlog({
          title: 'Testi title 3',
          author: 'Testi author 3',
          url: 'Testi url 3',
          likes: 10,
        })
        cy.addBlog({
          title: 'Testi title 4',
          author: 'Testi author 4',
          url: 'Testi url 4',
          likes: 8,
        })

        cy.get('ul>li').eq(0).should('contain', 'Testi title 3')
        cy.get('ul>li').eq(1).should('contain', 'Testi title 4')
        cy.get('ul>li').eq(2).should('contain', 'Testi title 2')
        cy.get('ul>li').eq(3).should('contain', 'Testi title 1')

        cy.get('ul>li').eq(0).contains('view').click()
        cy.get('ul>li').eq(0).contains('likes 10')

        cy.get('ul>li').eq(1).contains('view').click()
        cy.get('ul>li').eq(1).contains('likes 8')

        cy.get('ul>li').eq(2).contains('view').click()
        cy.get('ul>li').eq(2).contains('likes 4')

        cy.get('ul>li').eq(3).contains('view').click()
        cy.get('ul>li').eq(3).contains('likes 1')
      })
    })
  })
})
