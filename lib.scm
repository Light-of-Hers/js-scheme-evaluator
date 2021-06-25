(define (not a) (if a #f #t))

(define (list . lst) lst)

(define (exist? pred lst)
  (cond 
    [(null? lst) #f]
    [(pred (car lst)) #t]
    [else (exist? pred (cdr lst))]))

(define (forall? pred lst)
  (cond 
    [(null? lst) #t]
    [(pred (car lst)) (forall? pred (cdr lst))]
    [else #f]))

(define map
  (letrec ([single-map (lambda (fun lst)
                         (if (null? lst)
                             '()
                             (cons (fun (car lst)) (single-map fun (cdr lst)))))]
           [multi-map (lambda (fun lsts)
                        (if (exist? null? lsts)
                            '()
                            (cons 
                             (apply fun (single-map car lsts))
                             (multi-map fun (single-map cdr lsts)))))])
    (lambda (fun . lsts) (multi-map fun lsts))))

(define (for-each fun . lsts)
  (if (exist? null? lsts)
      (void)
      (begin (apply fun (map car lsts)) 
             (apply for-each (cons fun (map cdr lsts))))))

(define (foldl fun init lst)
  (let iter ([acc init] [lst lst])
    (if (null? lst)
        acc
        (iter (fun acc (car lst)) (cdr lst)))))

(define (foldr fun init lst)
  (if (null? lst)
      init 
      (fun (car lst) (foldr fun init (cdr lst)))))

(define (length lst)
  (foldl (lambda (acc v) (+ acc 1)) 0 lst))

(define (list-ref lst n)
  (if (<= n 0)
      (car lst)
      (list-ref (cdr lst) (- n 1))))

(define (filter pred lst)
  (foldr (lambda (v lst)
           (if (pred v)
               (cons v lst)
               lst))
         '() lst))

(define (append . lsts)
  (foldr (lambda (l1 l2) (foldr cons l2 l1)) '() lsts))

(define (partial fun . cached-args)
  (lambda args (apply fun (append cached-args args))))

(define zip (partial map list))

(define (flat-map . args)
  (apply append (apply map args)))

(define interleave (partial flat-map list))

(define reverse (partial foldl (lambda (acc cur) (cons cur acc)) '()))

(define (range a . bc)
  (define beg 0)
  (define end a)
  (define step 1)
  (if (null? bc)
      '天有洪炉
      (begin (set! beg a) (set! end (car bc)) 
             (if (null? (cdr bc))
                 '地生五金
                 (set! step (car (cdr bc))))))
  (define cmp (if (> step 0) >= <=))
  (define (recur n)
    (if (cmp n end)
        '()
        (cons n (recur (+ n step)))))
  (recur beg))
