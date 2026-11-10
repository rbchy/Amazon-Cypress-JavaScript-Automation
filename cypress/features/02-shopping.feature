Feature: Shopping Workflows
  As an Amazon customer
  I want to search, browse, and purchase products
  So that I can shop efficiently

  Background:
    Given I am on Amazon home page
    And I am logged in as "testuser@gmail.com"

  Scenario: TC-004 - Search product by keyword
    When I click on search box
    And I enter search keyword "laptop"
    And I press Enter or click Search button
    Then I should see search results page
    And I should see list of laptop products
    And I should see price for each product
    And I should see star ratings
    And I should see product images

  Scenario: TC-004 - Search with filters
    When I click on search box
    And I enter search keyword "laptop"
    And I press Enter or click Search button
    Then I should see search results
    When I apply filter "Price: $500-$1000"
    And I apply filter "Brand: Dell"
    And I apply filter "Rating: 4+ stars"
    Then I should see filtered results
    And All products should be within selected price range
    And All products should be from Dell brand
    And All products should have 4+ rating

  Scenario: TC-004 - Sort search results
    When I click on search box
    And I enter search keyword "headphones"
    And I press Enter or click Search button
    Then I should see sort dropdown
    When I select sort option "Price: Low to High"
    Then results should be sorted by ascending price
    When I select sort option "Highest Rating"
    Then results should be sorted by rating descending
    When I select sort option "Newest"
    Then results should show newest products first

  Scenario: TC-005 - Add single product to cart
    When I search for product "Dell Laptop 15-inch"
    And I click on first product result
    Then I should see product details page
    When I enter quantity "1"
    And I click Add to Cart button
    Then I should see "Added to Cart" confirmation
    And Cart count should increase to "1"
    And I should see success toast message

  Scenario: TC-005 - Add multiple items to cart
    When I search for product "laptop"
    And I click on first product result
    And I enter quantity "1"
    And I click Add to Cart button
    And I search for product "mouse"
    And I click on first product result
    And I enter quantity "2"
    And I click Add to Cart button
    Then Cart should have 2 items
    And Cart count should display "3"

  Scenario: TC-005 - Add out-of-stock product to cart
    When I search for product "unavailable-item"
    And I click on first product result
    Then I should see "Out of Stock" message
    And Add to Cart button should be disabled
    And I should see "Notify Me" button instead

  Scenario: TC-006 - Remove product from cart
    Given I have added "Dell Laptop" to cart
    When I go to Shopping Cart
    Then I should see "Dell Laptop" in cart
    And I should see cart subtotal
    When I click Remove button for "Dell Laptop"
    Then I should see confirmation message
    And Product should be removed from cart
    And Cart should be updated
    And Cart count should decrease

  Scenario: TC-006 - Update cart quantity
    Given I have added "Laptop" quantity 1 to cart
    When I go to Shopping Cart
    And I change quantity to "3"
    And I press Update or click refresh
    Then Cart should show quantity "3"
    And Subtotal should be recalculated
    And Price should reflect new quantity

  Scenario: TC-006 - Clear entire cart
    Given I have multiple items in cart
    When I click on Cart menu
    And I click on Delete all or Clear Cart option
    Then all products should be removed
    And Cart should be empty
    And Message "Your cart is empty" should appear

  Scenario: TC-007 - Complete checkout process
    Given I have items in cart
    When I go to Shopping Cart
    And I click Proceed to Checkout button
    Then I should see checkout page
    When I select shipping address
    And I select shipping method "Standard (5-7 days)"
    And I select payment method "Credit Card"
    And I enter card details
    And I review order summary
    And I click Place Order button
    Then I should see order confirmation page
    And I should see Order Number
    And Order should be confirmed successfully

  Scenario: TC-007 - Checkout with new address
    Given I have items in cart
    When I go to Shopping Cart
    And I click Proceed to Checkout button
    And I click Add New Address
    And I enter address "123 Main Street"
    And I enter city "New York"
    And I enter state "NY"
    And I enter zip code "10001"
    And I save address
    Then new address should be selected
    When I continue checkout process
    And I place order
    Then Order should be confirmed with new address

  Scenario: TC-007 - Apply coupon code at checkout
    Given I have items in cart
    When I go to Shopping Cart
    And I click Proceed to Checkout button
    And I enter coupon code "SAVE10"
    And I click Apply Coupon
    Then Discount should be applied
    And Order total should be reduced
    And Discount amount should show on summary

  Scenario: TC-007 - Checkout with different payment methods
    Given I have items in cart
    When I go to Shopping Cart
    And I click Proceed to Checkout button
    And I select payment method "Amazon Pay"
    Then I should see Amazon Pay confirmation
    When I go back and select payment method "Credit Card"
    Then I should see credit card fields
    When I select payment method "Debit Card"
    Then I should see debit card fields
