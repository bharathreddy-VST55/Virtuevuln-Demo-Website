describe('Log In', () => {
  beforeEach(() => cy.visit('/userlogin'));

  it('should successfully logs in', () => {
    // we can submit form using "cy.submit" command
    // https://on.cypress.io/submit
    cy.get('input[name=user]').type('admin');
    cy.get('input[name=password]').type('admin');
    cy.get('button[type=submit]').click();

    // we should be in
    cy.url().should('include', '/');
    cy.get('a.get-started-btn').should('contain', 'Log out admin');
  });

  it('should displays errors on login', function () {
    // alias this request so we can wait on it later
    cy.intercept('POST', '/api/auth/login').as('postLogin');

    // incorrect username on password
    cy.get('input[name=user]').type('jane.lae');
    cy.get('input[name=password]').type('password123{enter}');

    // we should always explicitly check if the status equals 500
    cy.wait('@postLogin').then((interception) => {
      expect(interception.response?.statusCode).to.eq(500);
    });

    // and still be on the same URL
    cy.url().should('include', '/userlogin');
  });

  it('can stub the XHR to force it to fail', function () {
    // alias this request so we can wait on it later
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 503,
      delay: 5000
    }).as('postLogin');

    // correct username on password
    cy.get('input[name=user]').type('admin');
    cy.get('input[name=password]').type('admin{enter}');

    // check for intercepted response stub status
    cy.wait('@postLogin').then((interception) => {
      expect(interception.response?.statusCode).to.eq(503);
    });

    // and still be on the same URL
    cy.url().should('include', '/userlogin');
  });
});
