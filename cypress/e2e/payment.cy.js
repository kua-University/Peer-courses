describe('Payment Flow', () => {
    beforeEach(() => {
        cy.login();
    });

    it('should allow user to purchase a course using Stripe', () => {
        cy.visit('/courses');
        cy.contains('React Basics').click();

        cy.get('button.buy-course').click();
        cy.url().should('include', 'checkout.stripe.com'); // Redirects to Stripe

        cy.completeStripePayment(); // Mock payment function
        cy.url().should('include', '/courses/react-basics');
        cy.contains('Access Course').should('exist'); // Verify unlocked content
    });
});
