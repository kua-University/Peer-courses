describe('Course Management', () => {
    beforeEach(() => {
        cy.login(); // Custom Cypress command to log in
    });

    it('should allow a user to create a new course', () => {
        cy.visit('/create-course');

        cy.get('input[name="title"]').type('React Basics');
        cy.get('textarea[name="description"]').type('Learn React from scratch');
        cy.get('button[type="submit"]').click();

        cy.contains('React Basics').should('exist'); // Verify course appears
    });

    it('should allow a user to edit a course', () => {
        cy.visit('/my-courses');

        cy.contains('React Basics').parent().find('button.edit-course').click();
        cy.get('input[name="title"]').clear().type('React Advanced');
        cy.get('button[type="submit"]').click();

        cy.contains('React Advanced').should('exist'); // Verify title update
    });

    it('should allow a user to delete their own course', () => {
        cy.visit('/my-courses');

        cy.contains('React Advanced').parent().find('button.delete-course').click();
        cy.contains('React Advanced').should('not.exist'); // Verify deletion
    });
});
