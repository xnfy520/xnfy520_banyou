<?php
    class EmptyAction extends Action{
        public function index(){
            $this->redirect('/admin');
        }
    }