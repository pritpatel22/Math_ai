import re
import sympy as sp

def preprocess_equation(equation):
    """
    Convert human-readable equation to a SymPy-compatible format.
    """
    # Replace common symbols with SymPy-compatible symbols
    equation = equation.replace('÷', '/').replace('×', '*')  # Replace division and multiplication symbols
    equation = equation.replace('^', '**')  # Replace exponentiation
    
    # Handle implicit multiplication
    equation = re.sub(r'(\d+)\s*\(', r'\1 * (', equation)  # e.g., 2(1+2) -> 2*(1+2)
    equation = re.sub(r'([a-zA-Z])\(', r'\1*(', equation)  # e.g., x(y+z) -> x*(y+z)

    # Handle logarithmic and trigonometric functions
    equation = re.sub(r'\b(log|ln)\b', 'log', equation)
    equation = re.sub(r'\bsin\b', 'sp.sin', equation)
    equation = re.sub(r'\bcos\b', 'sp.cos', equation)
    equation = re.sub(r'\btan\b', 'sp.tan', equation)

    # Replace mathematical constants
    equation = equation.replace('π', 'sp.pi').replace('e', 'sp.exp(1)')  # Replace π and e with SymPy constants

    # Ensure balanced parentheses
    open_parens = equation.count('(')
    close_parens = equation.count(')')
    if open_parens > close_parens:
        equation += ')' * (open_parens - close_parens)
    elif close_parens > open_parens:
        equation = '(' * (close_parens - open_parens) + equation

    # Handle derivatives and integrals
    equation = re.sub(r'∫\s*(.*?)\s*dx', r'sp.integrate(\1, x)', equation)
    equation = re.sub(r'∂\s*(.*?)\s*/\s*∂\s*(.*?)$', r'sp.diff(\1, \2)', equation)

    # Handle implicit multiplication between number and variable (e.g., 2x -> 2*x)
    equation = re.sub(r'(\d+)([a-zA-Z])', r'\1*\2', equation)
    
    # Clean up extra spaces
    equation = re.sub(r'\s+', ' ', equation).strip()

    return equation

def solve_equation_with_sympy(equation):
    # Preprocess the equation to make it SymPy-compatible
    processed_text = preprocess_equation(equation)
    print("Processed equation:", processed_text)

    try:
        # If there's no '=' in the equation, consider it an expression and evaluate it
        if '==' not in processed_text and '=' not in processed_text:
            sympy_expr = sp.sympify(processed_text)
            solution = sympy_expr
        else:
            # Split the equation into left-hand side and right-hand side
            lhs, rhs = processed_text.split('==')
            sympy_expr = sp.Eq(sp.sympify(lhs), sp.sympify(rhs))
            # Solve the equation
            solution = sp.solve(sympy_expr)
        
        # Convert solution to a format suitable for JSON
        if isinstance(solution, list):
            solution = [str(sol) for sol in solution]
        else:
            solution = str(solution)
        
        return solution

    except Exception as e:
        return str(e)

# Test the function with various cases
test_cases = [
    '6 ÷ 2(1 + 2) =',                # Implied multiplication
    '2x + 3 = 7',                     # Simple linear equation
    'sin(π / 2) = 1',                 # Trigonometric function
    'e^x = 5',                        # Exponential equation
    'log(100) = 2',                   # Logarithmic equation
    'x^2 - 4x + 4 = 0',               # Quadratic equation
    '∫ x^2 dx',                       # Integration
    '∂(x^2 + y^2)/∂x',                # Partial differentiation
    'x^3 - 27 =',                     # Cubic equation
    'x^2 + 4x + 4 >= 0',              # Inequality
]

for text in test_cases:
    solution_text = solve_equation_with_sympy(text)
    print(f"Equation: {text}\nSolution: {solution_text}\n")
