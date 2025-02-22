describe('Tutorial Management', () => {
    beforeEach(() => {
        cy.login(); // Custom Cypress command to log in
    });

    it('should allow a user to upload a tutorial', () => {
        cy.visit('/add-tutorial');

        cy.get('input[name="title"]').type('Intro to Hooks');
        cy.get('input[type="file"]').attachFile('sample.pdf'); // Use a sample PDF file
        cy.get('button[type="submit"]').click();

        cy.contains('Intro to Hooks').should('exist'); // Verify tutorial upload
    });

    it('should restrict users from editing tutorials they don’t own', () => {
        cy.visit('/tutorials');

        cy.contains('Intro to Hooks').parent().find('button.edit-tutorial').should('not.exist');
    });
});
