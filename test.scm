; basic equaltiy
(displayln (eq? 114514 114514)) ; #t
(displayln (eq? 114514 1919810)) ; #f
(displayln (eq? 'yiiyo 'yiiyo)) ; #t
(displayln (eq? 'yiiyo 'koyiyo)) ; #f
(displayln (eq? 114514 'yiiyokoyiyo)) ; #f
(displayln (eq? #t #t)) ; #t
(displayln (eq? #t #f)) ; #f
(displayln (eq? '(1 2 3) '(1 2 3))) ; #f
(displayln (equal? '压力马斯内 '压力马斯内))
(displayln (equal? '(1 2 3) '(1 2 3))) ; #t
(newline)

(define (check a b . opt-tag)
  (define res (if (equal? a b) 'passed 'failed))
  (if (null? opt-tag) 
      (displayln res) 
      (begin (display (car opt-tag)) (display ':) (displayln res))))

; arithmetic
(check (+) 0)
(check (+ 1) 1)
(check (+ 1 1) 2)
(check (+ 1 2 3 4) 10)
(check (- 1) -1)
(check (- 1 2) -1)
(check (- 1 2 3 4) -8)
(check (*) 1)
(check (* 1) 1)
(check (* 1 2) 2)
(check (* 1 2 3 4) 24)
(check (/ 2) 0.5)
(check (/ 2 4) 0.5)
(check (/ 1 2 4) 0.125)
(check (* (+ 1 2) 3) 9)
(check (= (+ 1 2) (+ 2 1) (+ 1 1 1)) #t)
(check (< 1 2) #t)
(check (< 1 2 3) #t)
(check (< 1 3 2) #f)
(check (> 1 2) #f)
(check (<= 1 1) #t)
(check (>= 1 2) #f)
(check (!= 1 2) #t)
(newline)

; predicate
(check (null? '()) #t)
(check (null? 1) #f)
(check (void? (void)) #t)
(check (void? '1) #f)
(check (pair? '(1 . 2)) #t)
(check (pair? (cons 1 '2)) #t)
(check (pair? '()) #f)
(check (pair? 1) #f)
(check (number? 1) #t)
(check (number? '1) #t)
(check (number? 'emmmm) #f)
(check (boolean? #t) #t)
(check (boolean? 1) #f)
(check (symbol? 'this-is-a-symbol) #t)
(check (symbol? '这是一个符号) #t)
(check (symbol? '(this is a list , not a symbol)) #f)
(check (symbol? '(这是一个列表 , 不是个符号)) #f)
(check (procedure? procedure?) #t)
(check (procedure? (lambda () '(this is a closure))) #t)
(check (procedure? 1) #f)
(newline)

; basic pair/list operation
(check (cons 1 2) '(1 . 2))
(check (list 1 2 3) '(1 2 3))
(check (list 1 2 3) (cons 1 (cons 2 (cons 3 '()))))
(check (list 1 2 3) '(1 . (2 . (3 . ()))))
(check (car (cons 1 2)) 1)
(check (cdr (cons 1 2)) 2)
(check (car '(1 2 3)) 1)
(check (cdr '(1 2 3)) '(2 3))
(newline)

; basic side effect operation
(let ()
  (set! x '哦!我的孩子!)
  (check x '哦!我的孩子!)
  
  (set! x '(你 , 该何去何从?))
  (check x '(你 , 该何去何从?))
  
  (set-car! x '我)
  (check x '(我 , 该何去何从?))
  
  (set-cdr! x '(, 拿着六便士 , 抬头看月亮))
  (check x '(我 , 拿着六便士 , 抬头看月亮))
  )
(newline)

; logical and condition
(check (and) #t)
(check (and #t #t #t) #t)
(check (and #t #f) #f)
(check (or) #f)
(check (or #t #f #f) #t)
(check (or #f #f) #f)
(check (not #t) #f)
(check (not #f) #t)
(check (if #t 1 2) 1)
(check (if #f (if #f 1 2) (if #f 3 4)) 4)
(check (cond [#t 1] [#f 2]) 1)
(check (cond [#f 1] [#t 2]) 2)
(check (cond [#f 1] [#f 2] [#f 3] [#t 4]) 4)
(check (cond [#f 1] [#f 2] [#f 3] [else 4]) 4)
(check (cond [#f 1] [#f 2] [#f 3]) (void))
(newline)

; recursion
(let ()
  (define (check-fib fibonacci)
    (check (fibonacci 10) 55)
    (check (fibonacci 20) 6765))
  
  (define (fib-naive n)
    (cond [(<= n 0) 0]
          [(= n 1) 1]
          [else (+ (fib-naive (- n 1)) (fib-naive (- n 2)))]))
  (check-fib fib-naive)
  
  (define fib-iter-letrec
    (letrec ([iter (lambda (n a b)
                     (if (= n 0)
                         a 
                         (iter (- n 1) b (+ a b))))])
      (lambda (n) (iter n 0 1))))
  (check-fib fib-iter-letrec)
  
  (define (fib-iter-def n)
    (define (iter n a b)
      (if (= n 0)
          a
          (iter (- n 1) b (+ a b))))
    (iter n 0 1))
  (check-fib fib-iter-def)
  
  (define (fib-iter-named-let n)
    (let iter ([n n] [a 0] [b 1])
      (if (= n 0)
          a
          (iter (- n 1) b (+ a b)))))
  (check-fib fib-iter-named-let)
  
  )
(newline)

; mutual recursion
(letrec ([even? (lambda (n)
                  (if (= n 0)
                      #t
                      (odd? (- n 1))))]
         [odd? (lambda (n)
                 (if (= n 0)
                     #f
                     (even? (- n 1))))])
  (check (even? 12) #t)
  (check (even? 9) #f)
  (check (odd? 11) #t)
  (check (odd? 10) #f))
(newline)

; lib functions
(check ((partial + 1 2) 3) 6)
(check ((partial < 1) 2) #t)
(check (exist? (partial < 0) '()) #f)
(check (exist? (partial < 0) '(0 1 2)) #t)
(check (exist? (partial < 0) '(0 -1 -2)) #f)
(check (forall? (partial < 0) '()) #t)
(check (forall? (partial < 0) '(1 2 3)) #t)
(check (forall? (partial < 0) '(0 1 2)) #f)
(check (map (partial + 1) '(0 1 2)) '(1 2 3))
(check (map + '(1 2 3) '(4 5 6) '(7 8 9)) '(12 15 18))
(check (map range '(1 2 3)) '((0) (0 1) (0 1 2)))
(check (map range '(1 3 5) '(3 5 7)) '((1 2) (3 4) (5 6)))
(check (filter symbol? '(1 和 2 and 3)) '(和 and))
(check (filter (partial != 1) '(1 3 1 4 5 2 0)) '(3 4 5 2 0))
(check (foldl + 0 '(1 2 3)) (+ 0 1 2 3))
(check (foldr + 0 '(1 2 3)) (+ 0 1 2 3))
(check (foldl - 0 '(1 2 3)) (- (- (- 0 1) 2) 3))
(check (foldr - 0 '(1 2 3)) (- 1 (- 2 (- 3 0))))
(check (length '(1 2 3)) 3)
(check (append '(1 2 3) '(4 5 6) '(7 8 9)) '(1 2 3 4 5 6 7 8 9))
(check (append '(1 2 3) '(4 5 6)) (foldr cons '(4 5 6) '(1 2 3)))
(check (zip '(1 2 3) '(4 5 6) '(7 8 9)) '((1 4 7) (2 5 8) (3 6 9)))
(check (map list '(1 2 3) '(4 5 6) '(7 8 9)) '((1 4 7) (2 5 8) (3 6 9)))
(check (flat-map range '(1 3 5) '(3 5 7)) '(1 2 3 4 5 6))
(check (interleave '(1 3 5) '(2 4 6)) '(1 2 3 4 5 6))
(check (flat-map list '(1 3 5) '(2 4 6)) '(1 2 3 4 5 6))
(check (reverse '(1 2 3)) '(3 2 1))
(check (reverse (range 0 10 2)) (range 8 -1 -2))
(check (range 0 10 2) '(0 2 4 6 8))
(newline)
