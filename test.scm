(foldl + 0 '(1 2 3))
(filter (lambda (x) (> x 0)) '(1 2 -2 3 -3))
(append '(1 2 3) '(4 5 6))
(zip '(1 2 3) '(4 5 6))
(interleave '(1 2 3) '(4 5 6))
(reverse '(1 2 3 4))

(define (fib n)
    (let iter ([n n] [a 0] [b 1])
        (if (= n 0)
            a
            (iter (- n 1) b  (+ a b)))))
(displayln (fib 10))
